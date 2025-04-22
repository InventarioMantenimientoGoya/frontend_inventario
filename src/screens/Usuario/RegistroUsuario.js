import React, { useState } from "react";
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
    Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/globalStyles';
import Tooltip from "../../Tooltip";
import { Transmision } from "./Transmision";
import { encriptarPassword } from "./Hash";
import { getUsuarios } from "../../Models/UsuarioModel";

const RegistroUsuario = () => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions(); // 📏 Detecta el ancho de la pantalla

    const [isModalCargaVisible, setIsModalCargaVisible] = useState(false);
    const [isModalRepetidoVisible, setIsModalRepetidoVisible] = useState(false);

    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [correoError, setCorreoError] = useState("");

    const handleAgregar = async () => {
        try {
            const usuariosData = await getUsuarios(); // Llama tu función para obtener los usuarios

            // Verifica si el correo ya existe
            const usuarioExistente = usuariosData.find(user => user.Usu_email.trim().toLowerCase() === correo.trim().toLowerCase());

            if (usuarioExistente) {
                setIsModalRepetidoVisible(true); // Muestra modal de usuario existente
                return;
            }

            const contrasenaEncriptada = await encriptarPassword(password);

            // Aquí capturas todos los datos del formulario
            const nuevoUsuario = {
                nombres: nombres,
                apellidos: apellidos,
                correo: correo.trim(),
                telefono: telefono,
                password: contrasenaEncriptada,
            };

            // Si la contraseña es correcta, seguimos con el flujo normal
            const usuarioEncriptado = await Transmision.encrypt(nuevoUsuario);

            navigation.navigate('Verificacion_Registro', {
                usuario: usuarioEncriptado, // Aquí estás pasando el valor de correoEncriptado
            });

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

    const isFormValid = password.length >= 8 && password === confirmarPassword && correoError === "" && correo !== "";

    const isSmallScreen = width < 600;

    return (
        <ImageBackground
            source={require('../../../assets/img/Img_4.jpg')}
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
                        <Text style={styles.descriptionModal}>El usuario ya está registrado. Por favor, cree uno nuevo.</Text>
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

            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back-ios" size={24} color="#1F2C73" style={styles.iconoFlecha} />
            </Pressable>

            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.card}>
                        <Image source={require("../../../assets/img/logo.png")} style={styles.logo} />
                        <Text style={styles.title}>CREAR CUENTA</Text>

                        <View style={styles.formContainer}>
                            <View style={[styles.row, isSmallScreen && styles.column]}>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <View style={styles.inputWrapper}>
                                        <TextInput style={styles.input} placeholder="Nombres" value={nombres}
                                            onChangeText={setNombres} />
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
                                        <TextInput style={styles.input} placeholder="Apellidos" value={apellidos}
                                            onChangeText={setApellidos} />
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

                            <TouchableOpacity
                                style={[styles.button, !isFormValid && styles.buttonDisabled]}
                                onPress={handleAgregar}
                                disabled={!isFormValid}
                            >
                                <Text style={styles.buttonText}>Finalizar Registro</Text>
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

export default RegistroUsuario;
