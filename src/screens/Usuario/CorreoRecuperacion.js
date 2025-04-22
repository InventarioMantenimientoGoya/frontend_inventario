import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Image, ImageBackground, Pressable, Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUsuarios } from "../../Models/UsuarioModel";
import { correoRestablecer } from "./FuncionesUsuario";
import { Transmision } from "./Transmision";
import { urlApi } from "../../../constants";

const CorreoRecuperacion = () => {
    const navigation = useNavigation();
    const [correo, setCorreo] = useState("");

    const [isModalCargaVisible, setIsModalCargaVisible] = useState(false);
    const [isModalInexistenteVisible, setIsModalInexistenteVisible] = useState(false);

    const handleEnviar = async () => {
        try {
            // Obtener los usuarios
            const usuariosData = await getUsuarios();

            // Buscar al usuario en la lista
            const usuarioEncontrado = usuariosData.find(
                (usuario) => usuario.Usu_email?.toLowerCase() === correo.toLowerCase()
            );

            if (usuarioEncontrado) {
                // Enviar correo de reestablecimiento
                const correoEnviado = await correoRestablecer(
                    usuarioEncontrado.Usu_email,
                    `${urlApi}cambiar_contrasena/${usuarioEncontrado.Usu_email}/`
                );

                if (correoEnviado) {
                    const correoEncriptado = await Transmision.encrypt(usuarioEncontrado.Usu_email);
                    navigation.navigate("Olvido_Contrasena", { correo: correoEncriptado });
                }
            } else {
                setIsModalInexistenteVisible(true);
            }

        } catch (error) {
            // Manejo de error: Mostrar modal de carga o error
            setIsModalCargaVisible(true);
        }
    };

    return (
        <ImageBackground
            source={require('../../../assets/img/Img_7.jpg')}
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
                visible={isModalInexistenteVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡USUARIO NO ENCONTRADO!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>El usuario no existe. Por favor, cree una cuenta.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => setIsModalInexistenteVisible(false)}
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
                <View style={styles.card}>
                    <Image source={require("../../../assets/img/logo.png")} style={styles.logo} />
                    <Text style={styles.title}>RECUPERAR CONTRASEÑA</Text>
                    <Text style={styles.subtitle}>
                        Ingrese su correo electrónico para enviarle el enlace de recuperación.
                    </Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo Electrónico"
                            keyboardType="email-address"
                            value={correo}
                            onChangeText={setCorreo}
                            autoCapitalize="none"
                        />
                        <Icon name="envelope" size={20} color={"#858484"} style={styles.inputIcon} />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, correo.length === 0 && styles.buttonDisabled]}
                        onPress={handleEnviar}
                        disabled={correo.length === 0}
                    >
                        <Text style={styles.buttonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
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
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    card: {
        backgroundColor: "#ECECEC",
        width: "90%",
        maxWidth: 400,
        padding: 30,
        borderRadius: 10,
        alignItems: "center",
        overflow: "hidden",
        paddingTop: 70, // 👈 le da espacio para que no choque con el logo
    },
    logo: {
        position: "absolute",
        top: -5,
        right: 10,
        width: 65,
        height: 80,
        resizeMode: "contain"
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#616060",
        marginBottom: 15,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 15,
        color: "#616060",
        textAlign: "center",
        marginBottom: 25,
        lineHeight: 22,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#FFF",
    },
    input: {
        width: "90%",
        padding: 10,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        placeholderTextColor: "#858484",
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 25,
        width: 200,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    buttonDisabled: {
        backgroundColor: '#D3D3D3',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.primary
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

export default CorreoRecuperacion;
