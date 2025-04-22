import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Pressable } from "react-native";
import { useNavigation, useRoute  } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/globalStyles';
import { Transmision } from "./Transmision";

const OlvidoContrasena = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const { correo } = route.params;

    const correoUsuario = Transmision.decrypt(correo);

    console.log(correoUsuario);

    // Función para enmascarar el correo
    const enmascararCorreo = (correo) => {
        const [nombre, dominio] = correo.split("@");
        const dominioOculto = dominio.replace(/./g, "*");
        return `${nombre}@${dominioOculto}`;
    };

    return (
        <ImageBackground
            source={require('../../../assets/img/Img_8.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay} />

            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back-ios" size={24} color="#1F2C73" style={styles.iconoFlecha} />
            </Pressable>

            <View style={styles.container}>
                <View style={styles.card}>
                    <Image source={require("../../../assets/img/logo.png")} style={styles.logo} />
                    <Text style={styles.title}>REESTABLECER CONTRASEÑA</Text>
                    <Text style={styles.subtitle}>
                        Para reestablecer su contraseña, hemos enviado un enlace al correo:{"\n"}
                        <Text style={styles.masked}>{enmascararCorreo(correoUsuario)}</Text>
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.replace('Login')}
                    >
                        <Text style={styles.buttonText}>Volver</Text>
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
        paddingTop: 70, // 👈 le da espacio para que no choque con el logo
        width: "90%",
        maxWidth: 400,
        padding: 30,
        borderRadius: 10,
        alignItems: "center",
        overflow: "hidden",
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
        fontSize: 24,
        color: "#616060",
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center"
    },

    subtitle: {
        fontSize: 15,
        color: "#616060",
        marginBottom: 25,
        textAlign: "center",
        lineHeight: 22
    },

    masked: {
        fontWeight: "bold",
        color: COLORS.primary
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

    buttonText: {
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: "bold"
    }
});

export default OlvidoContrasena;
