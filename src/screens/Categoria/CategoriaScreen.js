import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions,
    Pressable,
    Modal,
    TextInput,
    Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/globalStyles';
import Tooltip from "../../Tooltip";
import * as ImagePicker from 'expo-image-picker';
import { getCategorias } from '../../Models/CategoriaModel';
import { urlApi } from '../../../constants';

const { width, height } = Dimensions.get('window');

const CategoriaScreen = () => {
    const navigation = useNavigation();
    const [isSmallScreen, setIsSmallScreen] = useState(width <= 600);
    const [screenSizeCategory, setScreenSizeCategory] = useState('medium');
    const [isModalCargaVisible, setIsModalCargaVisible] = useState(false);
    const [isModalAgregarVisible, setIsModalAgregarVisible] = useState(false);
    const [isModalEditarVisible, setIsModalEditarVisible] = useState(false);
    const [isModalImagenVisible, setIsModalImagenVisible] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [imagen, setImagen] = useState(require("../../../assets/img/Img_12.png"));
    const [imagenPersonalizada, setImagenPersonalizada] = useState(null);
    const [eliminarFoto, setEliminarFoto] = useState(false);
    const [isModalRepetidoVisible, setIsModalRepetidoVisible] = useState(false);
    const [isModalRepetidoEditarVisible, setIsModalRepetidoEditarVisible] = useState(false);
    const [categoriasDB, setCategoriasDB] = useState([]);
    const [idCategoria, setIdCategoria] = useState(null);
    const [categoriaAnterior, setIdCategoriaAnterior] = useState(null);


    useEffect(() => {
        const handleResize = () => {
            const newWidth = Dimensions.get('window').width;
            setIsSmallScreen(newWidth <= 600);
        };

        const subscription = Dimensions.addEventListener('change', handleResize);
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const height = Dimensions.get('window').height;

            if (height <= 730) {
                setScreenSizeCategory('low');
            } else if (height > 730 && height <= 780) {
                setScreenSizeCategory('medium');
            } else {
                setScreenSizeCategory('high');
            }
        };

        handleResize(); // Llamarlo una vez al inicio

        const subscription = Dimensions.addEventListener('change', handleResize);
        return () => subscription.remove();
    }, []);

    useEffect(() => {

        const llamarCategorias = async () => {
            try {

                const categoriasData = await getCategorias();

                if (categoriasData) {

                    setIsModalCargaVisible(false);
                    setCategoriasDB(categoriasData);

                } else {
                    setIsModalCargaVisible(true);
                }

            } catch {
                setIsModalCargaVisible(true);
            }
        }

        llamarCategorias();

    }, []);

    const seleccionarImagen = async () => {
        let resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!resultado.canceled) {
            const uri = resultado.assets[0].uri;
            let fileSizeInKB;

            if (Platform.OS === 'web') {
                const response = await fetch(uri);
                const blob = await response.blob();
                fileSizeInKB = blob.size / 1024;
            } else {
                const { getInfoAsync } = await import('expo-file-system');
                const info = await getInfoAsync(uri);
                fileSizeInKB = info.size / 1024;
            }

            if (fileSizeInKB > 80) {
                setIsModalImagenVisible(true);
                return;
            }

            setImagenPersonalizada(uri);
        }
    };

    const cancelarImagen = () => {
        setImagenPersonalizada(null);
        setEliminarFoto(true);
    };

    const obtenerCategoria = (categoriaObtenida) => {
        if (categoriaObtenida) {
            setIdCategoria(categoriaObtenida.id || null);
            setIdCategoriaAnterior(categoriaObtenida.Cat_nombre || '');
            setTitulo(categoriaObtenida.Cat_nombre || '');
            setImagenPersonalizada(categoriaObtenida.Cat_foto || null);
        } else {
            setIdCategoria(null)
            setIdCategoriaAnterior('');
            setTitulo('');
            setImagenPersonalizada(null);
        }
    }

    const crearCategoria = async () => {
        try {

            const categoriaData = await getCategorias();

            const categoriaExistente = categoriaData.find(categoria => categoria.Cat_nombre.trim().toLowerCase() === titulo.trim().toLowerCase());

            if (categoriaExistente) {
                setIsModalAgregarVisible(false);
                setIsModalRepetidoVisible(true);
                return;
            }

            const nuevaCategoria = {
                "Cat_nombre": titulo,
            }

            const response = await fetch(urlApi + "categorias/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevaCategoria),
            });

            let response2;
            let nuevaCategoriaCreada = null;

            if (response.status === 201) {
                nuevaCategoriaCreada = await response.json(); // 🔑 Obtener el ID recién creado
            }

            if (imagenPersonalizada && nuevaCategoriaCreada) {
                const formData = new FormData();
                const timestamp = Date.now();
                const fileName = `categoria_${timestamp}.jpg`;

                if (Platform.OS === "web") {
                    const imgResponse = await fetch(imagenPersonalizada);
                    const blob = await imgResponse.blob();

                    formData.append("Cat_foto", new File([blob], fileName, {
                        type: "image/jpeg",
                    }));
                } else {
                    formData.append("Cat_foto", {
                        uri: imagenPersonalizada,
                        name: fileName,
                        type: "image/jpeg",
                    });
                }

                // 🔄 PATCH con el ID correcto de la categoría recién creada
                response2 = await fetch(urlApi + "categorias/" + nuevaCategoriaCreada.id + "/", {
                    method: "PATCH",
                    body: formData,
                });
            }

            if (response.status === 201 && response2.status === 200) {
                navigation.replace("Main");
            } else {
                setIsModalAgregarVisible(false);
                setIsModalCargaVisible(true);
                throw new Error("No se pudo crear la categoría.");
            }

        } catch (error) {
            setIsModalAgregarVisible(false);
            setIsModalCargaVisible(true);
        }
    }

    const editarCategoria = async () => {
        try {

            const categoriaData = await getCategorias();

            const categoriaExistente = categoriaData.find(categoria => categoria.Cat_nombre.trim().toLowerCase() === titulo.trim().toLowerCase() && categoria.Cat_nombre.trim().toLowerCase() !== categoriaAnterior.trim().toLowerCase());

            if (categoriaExistente) {
                setIsModalEditarVisible(false);
                setIsModalRepetidoVisible(true);
                return;
            }

            const editarCategoria = {
                "Cat_nombre": titulo,
            }

            const response = await fetch(urlApi + "categorias/" + idCategoria + "/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editarCategoria),
            });

            let response2;

            if (imagenPersonalizada) {
                const formData = new FormData();
                const timestamp = Date.now();
                const fileName = `categoria_${timestamp}.jpg`;

                if (Platform.OS === "web") {
                    const imgResponse = await fetch(imagenPersonalizada);
                    const blob = await imgResponse.blob();

                    formData.append("Cat_foto", new File([blob], fileName, {
                        type: "image/jpeg",
                    }));
                } else {
                    formData.append("Cat_foto", {
                        uri: imagenPersonalizada,
                        name: fileName,
                        type: "image/jpeg",
                    });
                }

                // 🔄 PATCH con el ID correcto de la categoría recién creada
                response2 = await fetch(urlApi + "categorias/" + idCategoria + "/", {
                    method: "PATCH",
                    body: formData,
                });
            }

            if (response.status === 200 || (response2 && response2.status === 200)) {
                navigation.replace("Main");
            } else {
                setIsModalEditarVisible(false);
                setIsModalCargaVisible(true);
                throw new Error("No se pudo editar la categoría.");
            }

        } catch (error) {
            setIsModalEditarVisible(false);
            setIsModalCargaVisible(true);
        }
    }

    const isFormValid = titulo !== "" && imagenPersonalizada !== null;

    return (

        <View style={[{ flex: 1 }, styles.container]}>

            {/* Modal de error de conexión */}
            <Modal
                visible={isModalCargaVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡ERROR DE CONEXIÓN!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>Ocurrió un problema al conectarse. Por favor, intente más tarde.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => {
                                setIsModalCargaVisible(false);
                            }}
                        >
                            <Text style={styles.buttonModalText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de error de conexión */}
            <Modal
                visible={isModalAgregarVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setImagenPersonalizada(null);
                    setIsModalAgregarVisible(false);
                }}
            >
                <View style={styles.modalOverlay}>
                    {/* Icono de cierre en la esquina superior derecha */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            setImagenPersonalizada(null);
                            setIsModalAgregarVisible(false);
                        }}
                    >
                        <MaterialIcons name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>AGREGAR CATEGORÍA</Text>
                        <View style={styles.inputWrapper}>

                            <TextInput
                                style={styles.input}
                                placeholder="Título"
                                onChangeText={setTitulo} value={titulo}
                            />

                            <View style={styles.infoIcon}>
                                <Tooltip message="Campo Obligatorio">
                                    <MaterialIcons name="info" size={24}
                                        color="#858484" />
                                </Tooltip>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', marginTop: 30 }}>
                            <View
                                style={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: 60,
                                    overflow: 'hidden',
                                    marginBottom: 10,
                                }}
                            >
                                <Image
                                    source={imagenPersonalizada ? { uri: imagenPersonalizada } : imagen}
                                    style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                                />
                            </View>

                            {!imagenPersonalizada ? (
                                <TouchableOpacity onPress={seleccionarImagen} style={[styles.button, { width: 180 }]}>
                                    <Text style={styles.buttonText}>SUBIR IMAGEN</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15 }}>
                                    <TouchableOpacity
                                        onPress={seleccionarImagen}
                                        style={[styles.circleButton, { backgroundColor: 'white' }]}
                                    >
                                        <MaterialIcons name="edit" size={24} color={COLORS.primary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={cancelarImagen}
                                        style={[styles.circleButton, { backgroundColor: 'white' }]}
                                    >
                                        <MaterialIcons name="close" size={24} color={COLORS.primary} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        {/* Botón de acción */}
                        <Pressable
                            style={[styles.buttonModal, !isFormValid && styles.buttonDisabled]}
                            onPress={crearCategoria}
                            disabled={!isFormValid}
                        >
                            <Text style={styles.buttonModalText}>Agregar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de error de conexión */}
            <Modal
                visible={isModalEditarVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    obtenerCategoria(null);
                    setIsModalEditarVisible(false);
                }}
            >
                <View style={styles.modalOverlay}>
                    {/* Icono de cierre en la esquina superior derecha */}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            obtenerCategoria(null);
                            setIsModalEditarVisible(false);
                        }}
                    >
                        <MaterialIcons name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>EDITAR CATEGORÍA</Text>
                        <View style={styles.inputWrapper}>

                            <TextInput
                                style={styles.input}
                                placeholder="Título"
                                onChangeText={setTitulo} value={titulo}
                            />

                            <View style={styles.infoIcon}>
                                <Tooltip message="Campo Obligatorio">
                                    <MaterialIcons name="info" size={24}
                                        color="#858484" />
                                </Tooltip>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', marginTop: 30 }}>
                            <View
                                style={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: 60,
                                    overflow: 'hidden',
                                    marginBottom: 10,
                                }}
                            >
                                <Image
                                    source={imagenPersonalizada ? { uri: imagenPersonalizada } : imagen}
                                    style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                                />
                            </View>

                            {!imagenPersonalizada ? (
                                <TouchableOpacity onPress={seleccionarImagen} style={[styles.button, { width: 180 }]}>
                                    <Text style={styles.buttonText}>SUBIR IMAGEN</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15 }}>
                                    <TouchableOpacity
                                        onPress={seleccionarImagen}
                                        style={[styles.circleButton, { backgroundColor: 'white' }]}
                                    >
                                        <MaterialIcons name="edit" size={24} color={COLORS.primary} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={cancelarImagen}
                                        style={[styles.circleButton, { backgroundColor: 'white' }]}
                                    >
                                        <MaterialIcons name="close" size={24} color={COLORS.primary} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        {/* Botón de acción */}
                        <Pressable
                            style={[styles.buttonModal, !isFormValid && styles.buttonDisabled]}
                            onPress={editarCategoria}
                            disabled={!isFormValid}
                        >
                            <Text style={styles.buttonModalText}>Guardar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de carga de datos */}
            <Modal
                visible={isModalImagenVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡LA IMAGEN ES DEMASIADO PESADA!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>La imagen es demasiado pesada. Asegúrese de que pese al menos 80 KB.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => setIsModalImagenVisible(false)}
                        >
                            <Text style={styles.buttonModalText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de carga de datos */}
            <Modal
                visible={isModalRepetidoVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡LA CATEGORÍA YA ESTÁ REGISTRADA!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>La categoría ya está registrada. Por favor, cree una nueva.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => setIsModalRepetidoVisible(false)}
                        >
                            <Text style={styles.buttonModalText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de carga de datos */}
            <Modal
                visible={isModalRepetidoEditarVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡LA CATEGORÍA YA ESTÁ REGISTRADA!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>La categoría ya está registrada. Por favor, verifique la información.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => setIsModalRepetidoEditarVisible(false)}
                        >
                            <Text style={styles.buttonModalText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <View style={{ flex: 1, backgroundColor: '#fff' }}>


                <View style={styles.contenedorPrincipal}>
                    <TouchableOpacity
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        style={styles.menuButton}
                    >
                        <Ionicons name="menu" size={30} color="#003366" />
                    </TouchableOpacity>
                    <Image
                        source={require("../../../assets/img/logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>CATEGORIAS</Text>


                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => { setIsModalAgregarVisible(true) }}>
                            <Text style={styles.buttonAccion}>Añadir Categoría</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView vertical showsVerticalScrollIndicator={true} style={[
                        styles.verticalScroll,
                        screenSizeCategory === 'low'
                            ? { maxHeight: 400 }
                            : screenSizeCategory === 'medium'
                                ? { maxHeight: 500 }
                                : { maxHeight: 600 }
                    ]}>
                        <View style={[styles.cardsContainer, { flexDirection: isSmallScreen ? 'column' : 'row' }]}>
                            {categoriasDB.map((categoria, index) => (
                                <View
                                    key={index}
                                    style={[styles.card, { width: isSmallScreen ? '100%' : '42%' }]}
                                >
                                    <Image
                                        source={{ uri: categoria.Cat_foto }} // con llaves dobles
                                        style={styles.cardBackground}
                                    />
                                    <View style={styles.overlay}>
                                        <Text style={styles.cardTitle}>{categoria.Cat_nombre.toUpperCase()}</Text>
                                        <Pressable
                                            style={styles.circularButton}
                                            onPress={() => {
                                                obtenerCategoria(categoria);
                                                setIsModalEditarVisible(true);
                                                // Puedes pasar datos de esta categoría si lo necesitas
                                            }}
                                        >
                                            <MaterialIcons name="edit" size={24} color="#1F2C73" />
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>

                </View>


            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        width: "100%",
        maxHeight: "100%",
    },
    contenedorPrincipal: {
        width: '100%',
        alignSelf: 'center',
        paddingBottom: "10%",
    },
    menuButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 12,
        zIndex: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 5,
        color: "#616060",
        paddingTop: 80,
    },
    verticalScroll: { width: '100%' },
    cardsContainer: {
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 30,
        marginTop: 10,
        marginBottom: 40, // Añade margen inferior por si hay muchas cards
        paddingHorizontal: 20,
    },
    card: {
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        elevation: 4,
    },
    cardBackground: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 6,
    },
    logo: {
        position: 'absolute',
        top: -24,
        right: 6,
        width: 50,
        height: 100,
        resizeMode: 'contain',
    },
    circularButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 10,
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 25,
        marginTop: 20,
        width: 250,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonAccion: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: "white",
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 15,
        width: '100%',
    },
    // Modal
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 400, // ✅ se adapta a pantallas pequeñas
        width: '90%', // ✅ ocupa un 90% pero nunca más que 400
        overflow: 'hidden',
    },
    titleModal: {
        fontSize: 20, fontFamily: 'Poppins-Bold', color: COLORS.secondary, marginBottom: 10, textAlign: 'center',
    },
    descriptionModal: {
        fontSize: 14, fontFamily: 'Poppins-Regular', color: 'black', textAlign: 'center', marginBottom: 20, width: '100%',
    },
    logoModal: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    buttonModal: {
        backgroundColor: COLORS.quaternary,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 25,
        marginTop: 20,
        width: 'auto',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        width: '100%',
    },
    buttonModalText: { fontSize: 16, fontFamily: 'Poppins-Medium', color: 'white' },
    buttonDisabled: {
        backgroundColor: '#D3D3D3',
    },
    inputWrapper: {
        width: '100%',
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: "#FFF",
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        placeholderTextColor: "#858484",
        width: "100%",
        fontFamily: 'Poppins-Regular',
        paddingRight: 35,
    },
    infoIcon: {
        position: 'absolute',
        top: '50%',
        right: 10,
        transform: [{ translateY: -12 }],
    },
    circleButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 25,
        marginTop: 20,
        width: 250,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: COLORS.primary,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,  // Asegura que el icono esté por encima de otros componentes
    },
});

export default CategoriaScreen;





