import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    ImageBackground,
    Pressable,
    useWindowDimensions,
    Platform,
    Modal
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/globalStyles';
import * as ImagePicker from 'expo-image-picker';
import Tooltip from "../../Tooltip";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUsuarios } from "../../Models/UsuarioModel";
import { encriptarPassword } from "./Hash";
import { Transmision } from "./Transmision";
import { urlApi } from "../../../constants";

const EditarUsuario = () => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions(); // 📏 Detecta el ancho de la pantalla
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const llamarUsuario = async () => {

            try {
                const usuarioLogueado = await AsyncStorage.getItem('usuario');

                const usuarioDescifrado = await Transmision.decrypt(usuarioLogueado);
                setUsuario(usuarioDescifrado);

            } catch (error) {
                console.error("Error al obtener el usuario.");
            }
        };

        llamarUsuario();
    }, []);

    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [area, setArea] = useState("");
    const [cargo, setCargo] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAnterior, setPasswordAnterior] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [imagen, setImagen] = useState(require("../../../assets/img/Img_6.png"));
    const [imagenPersonalizada, setImagenPersonalizada] = useState(null);
    const [correoError, setCorreoError] = useState("");
    const [isModalCargaVisible, setIsModalCargaVisible] = useState(false);
    const [isModalRepetidoVisible, setIsModalRepetidoVisible] = useState(false);
    const [isModalImagenVisible, setIsModalImagenVisible] = useState(false);
    const [eliminarFoto, setEliminarFoto] = useState(false);

    useEffect(() => {
        if (usuario) {
            setNombres(usuario.Usu_nombres || '');
            setApellidos(usuario.Usu_apellidos || '');
            setTelefono(usuario.Usu_telefono || '');
            setCorreo(usuario.Usu_email || '');
            setArea(usuario.Usu_area || '');
            setCargo(usuario.Usu_cargo || '');
            setPasswordAnterior(usuario.Usu_contrasena || '');
            setImagenPersonalizada(usuario.Usu_foto || null);
        }
    }, [usuario]);

    const handleEditar = async () => {
        try {

            const usuariosData = await getUsuarios(); // Llama tu función para obtener los usuarios

            // Verifica si el correo ya existe
            const usuarioExistente = usuariosData.find(user =>
                user.Usu_email.trim().toLowerCase() === correo.trim().toLowerCase() &&
                user.Usu_email.trim().toLowerCase() !== usuario.Usu_email.trim().toLowerCase()
            );

            if (usuarioExistente) {
                setIsModalRepetidoVisible(true); // Muestra modal de usuario existente
                return;
            }

            let contrasenaEnviar;

            if (password !== "") {
                contrasenaEnviar = await encriptarPassword(password);
            } else {
                contrasenaEnviar = passwordAnterior;
            }

            const editarUsuario = {
                "Usu_nombres": nombres,
                "Usu_apellidos": apellidos,
                "Usu_email": correo,
                "Usu_telefono": telefono,
                "Usu_cargo": cargo,
                "Usu_area": area,
                "Usu_rol": usuario.Usu_rol,
                "Usu_estado": usuario.Usu_estado,
                "Usu_contrasena": contrasenaEnviar,
            };

            let response2;

            // Si hay imagen personalizada
            if (imagenPersonalizada) {
                const formData = new FormData();
                const timestamp = Date.now();
                const fileName = `usuario_${timestamp}.jpg`;

                if (Platform.OS === "web") {
                    const response = await fetch(imagenPersonalizada);
                    const blob = await response.blob();

                    formData.append("Usu_foto", new File([blob], fileName, {
                        type: "image/jpeg",
                    }));
                } else {
                    formData.append("Usu_foto", {
                        uri: imagenPersonalizada,
                        name: fileName,
                        type: "image/jpeg",
                    });
                }

                // Enviar el PATCH para la foto
                response2 = await fetch(urlApi + "usuarios/" + usuario.id + "/", {
                    method: "PATCH",
                    body: formData, // No pongas headers con Content-Type
                });
            } else if (eliminarFoto) {
                // 👉 Si se eliminó la foto, mandamos `Usu_foto: null`
                response2 = await fetch(urlApi + "usuarios/" + usuario.id + "/", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ Usu_foto: null }),
                });
            }


            const response = await fetch(urlApi + "usuarios/" + usuario.id + "/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editarUsuario),
            });

            // ✅ Validar explícitamente el status 201
            if (response.status === 200 || (response2 && response2.status === 200)) {

                if (correo !== usuario.Usu_email || contrasenaEnviar !== passwordAnterior) {
                    navigation.replace("Cerrar_Sesion_Editar");
                } else {
                    const usuarioActualizadoResponse = await fetch(urlApi + "usuarios/" + usuario.id + "/");
                    const usuarioActualizado = await usuarioActualizadoResponse.json();

                    const usuarioLogueadoActualizado = await Transmision.encrypt(JSON.stringify(usuarioActualizado));
                    await AsyncStorage.setItem('usuario', usuarioLogueadoActualizado);

                    navigation.replace("Main");
                }


            } else {
                setIsModalCargaVisible(true);
                throw new Error("No se pudo editar el usuario.");
            }

        } catch (error) {
            setIsModalCargaVisible(true); // Muestra modal de error de conexión
        }
    };

    const handleTelefonoChange = (text) => {
        const numeros = text.replace(/[^0-9]/g, '');
        setTelefono(numeros);
    };

    const handleCorreoChange = (text) => {
        setCorreo(text);

        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoRegex.test(text)) {
            setCorreoError("Ingrese un correo electrónico válido");
        } else {
            setCorreoError("");
        }
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        if (text.length < 8) {
            setPasswordError("La contraseña debe tener al menos 8 caracteres");
        } else {
            setPasswordError("");
        }
    };

    const handleConfirmarPasswordChange = (text) => {
        setConfirmarPassword(text);
        if (text !== password) {
            setConfirmPasswordError("Las contraseñas no coinciden");
        } else {
            setConfirmPasswordError("");
        }
    };

    const camposObligatoriosValidos =
        correoError === "" &&
        correo !== "" &&
        nombres !== "" &&
        apellidos !== "" &&
        telefono !== "";

    const contraseñaCambiadaYValida =
        password !== "" &&
        password.length >= 8 &&
        password === confirmarPassword &&
        password !== passwordAnterior;

    const isFormValid = camposObligatoriosValidos && (password === "" || contraseñaCambiadaYValida);

    const isSmallScreen = width < 600;

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


    return (
        <ImageBackground
            source={require('../../../assets/img/Img_9.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay} />

            {/* Modal de carga de datos */}
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
                        <Text style={styles.descriptionModal}>Ocurrió un problema al conectar. Por favor, intente más tarde.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => setIsModalCargaVisible(false)}
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
                        <Text style={styles.titleModal}>¡EL USUARIO YA ESTÁ REGISTRADO!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>El usuario ya está registrado. Por favor, verifique la información.</Text>
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

            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back-ios" size={24} color="#1F2C73" style={styles.iconoFlecha} />
            </Pressable>

            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.card}>
                        <Image source={require("../../../assets/img/logo.png")} style={styles.logo} />
                        <Text style={styles.title}>EDITAR DATOS</Text>

                        <View style={styles.formContainer}>
                            <View style={[styles.row, isSmallScreen && styles.column]}>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <View style={styles.inputWrapper}>
                                        <View pointerEvents="none">
                                            <TextInput
                                                style={[styles.input, styles.inputDisabled]}
                                                placeholder="Nombres"
                                                editable={false}
                                                selectTextOnFocus={false}
                                                focusable={false}
                                                value={nombres}
                                            />
                                        </View>
                                        <View style={styles.infoIcon}>
                                            <Tooltip message="Campo Obligatorio">
                                                <MaterialIcons name="info" size={24}
                                                    color="#858484" />
                                            </Tooltip>
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <View style={styles.inputWrapper}>
                                        <View pointerEvents="none">
                                            <TextInput
                                                style={[styles.input, styles.inputDisabled]}
                                                placeholder="Apellidos"
                                                editable={false}
                                                selectTextOnFocus={false}
                                                focusable={false}
                                                value={apellidos}
                                            />
                                        </View>
                                        <View style={styles.infoIcon}>
                                            <Tooltip message="Campo Obligatorio">
                                                <MaterialIcons name="info" size={24}
                                                    color="#858484" />
                                            </Tooltip>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.row, isSmallScreen && styles.column]}>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Correo Electrónico"
                                            value={correo}
                                            onChangeText={handleCorreoChange}
                                            keyboardType="email-address"
                                        />
                                        <View style={styles.infoIcon}>
                                            <Tooltip message="Campo Obligatorio">
                                                <MaterialIcons name="info" size={24}
                                                    color="#858484" />
                                            </Tooltip>
                                        </View>
                                    </View>
                                    {correoError ? (
                                        <Text style={styles.validacionText}>{correoError}</Text>
                                    ) : null}
                                </View>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Teléfono (60 - +57)"
                                            value={telefono}
                                            onChangeText={handleTelefonoChange}
                                            keyboardType="numeric"
                                        />
                                        <View style={styles.infoIcon}>
                                            <Tooltip message="Campo Obligatorio">
                                                <MaterialIcons name="info" size={24}
                                                    color="#858484" />
                                            </Tooltip>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.row, isSmallScreen && styles.column]}>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <TextInput style={styles.input} placeholder="Cargo" onChangeText={setCargo} value={cargo} />
                                </View>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <TextInput style={styles.input} placeholder="Área" onChangeText={setArea} value={area} />
                                </View>
                            </View>

                            <View style={[styles.row, isSmallScreen && styles.column]}>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Contraseña"
                                            value={password}
                                            onChangeText={handlePasswordChange}
                                            secureTextEntry={!showPassword}
                                        />
                                        <TouchableOpacity
                                            style={styles.eyeIcon}
                                            onPress={() => setShowPassword(!showPassword)}
                                        >
                                            <MaterialIcons
                                                name={showPassword ? "visibility-off" : "visibility"}
                                                size={24}
                                                color="#858484"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {passwordError ? (
                                        <Text style={styles.validacionText}>{passwordError}</Text>
                                    ) : null}
                                </View>

                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirmar Contraseña"
                                            value={confirmarPassword}
                                            onChangeText={handleConfirmarPasswordChange}
                                            secureTextEntry={!showConfirmPassword}
                                        />
                                        <TouchableOpacity
                                            style={styles.eyeIcon}
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <MaterialIcons
                                                name={showConfirmPassword ? "visibility-off" : "visibility"}
                                                size={24}
                                                color="#858484"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {confirmPasswordError ? (
                                        <Text style={styles.validacionText}>{confirmPasswordError}</Text>
                                    ) : null}
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


                            <TouchableOpacity
                                style={[styles.button, !isFormValid && styles.buttonDisabled]}
                                onPress={handleEditar}
                                disabled={!isFormValid}
                            >
                                <Text style={styles.buttonText}>GUARDAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1, width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.primary, opacity: 0.5 },

    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
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
    iconoFlecha: { left: 5 },
    container: { flex: 1 },
    scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center" },
    card: {
        marginTop: 40,
        backgroundColor: "#ECECEC",
        width: "90%",
        maxWidth: 600,
        padding: 20,
        borderRadius: 10,
        paddingTop: 70,
        marginBottom: 40,
    },
    logo: { position: "absolute", top: -5, right: 10, width: 65, height: 80, resizeMode: "contain" },
    title: {
        color: "#616060",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    formContainer: { width: "100%" },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        flexWrap: "wrap",
    },
    column: {
        flexDirection: "column",
    },
    inputGroup: {
        position: 'relative',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    fullWidth: {
        width: '100%',
        marginBottom: 10,
    },
    halfWidth: {
        width: '48%',
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
    inputDisabled: {
        backgroundColor: '#f0f0f0',
        color: '#999'
    },
    inputWrapper: {
        width: '100%',
        position: 'relative',
        justifyContent: 'center',
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
    buttonDisabled: {
        backgroundColor: '#D3D3D3',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: COLORS.primary,
    },
    eyeIcon: {
        position: 'absolute',
        top: '50%',
        right: 10,
        transform: [{ translateY: -12 }],
    },
    validacionText: {
        marginTop: 5,
        fontSize: 12,
        color: COLORS.primary,
        fontFamily: 'Poppins-Italic',
        marginLeft: 5,
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
    infoIcon: {
        position: 'absolute',
        top: '50%',
        right: 10,
        transform: [{ translateY: -12 }],
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
        fontSize: 26, fontFamily: 'Poppins-Bold', color: COLORS.secondary, marginBottom: 10, textAlign: 'center',
    },
    descriptionModal: {
        fontSize: 16, fontFamily: 'Poppins-Regular', color: 'black', textAlign: 'center', marginBottom: 20, width: '100%',
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
});

export default EditarUsuario;
