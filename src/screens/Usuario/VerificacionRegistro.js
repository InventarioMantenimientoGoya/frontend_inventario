import React, { useRef, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, Pressable, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/globalStyles';
import { Transmision } from "./Transmision"
import { correoUsuarioCodigo, generarCodigo } from "./FuncionesUsuario"
import { urlApi } from "../../../constants";
import  AuthService  from "./AuthService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const VerificacionRegistro = ({ route }) => {

    // Obtener usuarioCorreo desde los parámetros
    const { usuario } = route.params;

    const navigation = useNavigation();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputsRef = useRef([]);
    const [isModalCargaVisible, setIsModalCargaVisible] = useState(false);
    const [isModalVencimientoVisible, setIsModalVencimientoVisible] = useState(false);
    const [isModalValidacionVisible, setIsModalValidacionVisible] = useState(false);
    const [isModalAgotadoVisible, setIsModalAgotadoVisible] = useState(false);
    const [codigoGenerado, setCodigoGenerado] = useState(null);
    const intentosMaximos = 3;
    const intervalRef = useRef(null);

    const usuarioVerificado = Transmision.decrypt(usuario);

    // Simulando el correo que viene del login o props
    const correoUsuario = usuarioVerificado.correo;

    useEffect(() => {
        let intentos = 0;  // Mantiene el conteo de los intentos

        // Enviar el primer intento de inmediato
        const enviarPrimerCodigo = async () => {
            const primerCodigo = generarCodigo();
            setCodigoGenerado(primerCodigo);
            try {
                await correoUsuarioCodigo(correoUsuario, primerCodigo);
                intentos += 1;
            } catch (error) {
                setIsModalCargaVisible(true);
            }
        };

        enviarPrimerCodigo(); // Ejecutamos el primer código de inmediato

        // Luego configuramos los siguientes envíos automáticos cada 1 minuto
        intervalRef.current = setInterval(async () => {
            if (intentos < intentosMaximos) {
                // Mostrar modal de vencimiento si ya pasó el primer intento
                if (intentos > 0) {
                    setIsModalVencimientoVisible(true); // Mostrar que el código anterior venció
                }

                const nuevoCodigo = generarCodigo();
                setCodigoGenerado(nuevoCodigo);

                try {
                    await correoUsuarioCodigo(correoUsuario, nuevoCodigo);
                    intentos += 1;
                } catch (error) {
                    setIsModalCargaVisible(true);
                }
            } else {
                clearInterval(intervalRef.current);
                setIsModalAgotadoVisible(true); // Se agotaron los intentos
            }
        }, 60000); // 1 minuto entre intentos

        return () => clearInterval(intervalRef.current);
    }, []);


    // Función para enmascarar el correo después del @
    const enmascararCorreo = (correo) => {
        if (!correo) return ''; // Verifica si el correo es válido

        const [nombre, dominio] = correo.split("@");
        if (!dominio) return `${nombre}@***`; // Si no hay dominio, evita el error y muestra algo seguro
        const dominioOculto = dominio.replace(/./g, "*");
        return `${nombre}@${dominioOculto}`;
    };

    const handleChange = (text, index) => {
        if (/^\d$/.test(text) || text === '') {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            if (text !== '' && index < 5) {
                inputsRef.current[index + 1].focus();
            }
            if (text === '' && index > 0) {
                inputsRef.current[index - 1].focus();
            }
        }
    };


    const handleVerify = async () => {
        const codigoIngresado = otp.join('');

        if (codigoIngresado.length !== 6 || codigoIngresado !== codigoGenerado) {
            setIsModalValidacionVisible(true);
            return;
        }

        clearInterval(intervalRef.current);

        const nuevoUsuario = {
            "Usu_nombres": usuarioVerificado.nombres,
            "Usu_apellidos": usuarioVerificado.apellidos,
            "Usu_email": usuarioVerificado.correo,
            "Usu_telefono": usuarioVerificado.telefono,
            "Usu_rol": false,
            "Usu_estado": true,
            "Usu_contrasena": usuarioVerificado.password,
        };

        try {
            const response = await fetch(urlApi + "usuarios/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevoUsuario),
            });

            // ✅ Validar explícitamente el status 201
            if (response.status === 201) {

                const { token, usuario: usuarioLogueado } = await AuthService.login(usuarioVerificado.correo, usuarioVerificado.password);

                const usuarioLogueadoEncriptado = await Transmision.encrypt(usuarioLogueado);

                // Guardar el token y el usuario en AsyncStorage
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('usuario', usuarioLogueadoEncriptado);

                navigation.replace("Main");

            } else {
                setIsModalCargaVisible(true);
                throw new Error("No se pudo crear el usuario.");
            }

        } catch (error) {
            setIsModalCargaVisible(true);
        }
    };

    return (
        <ImageBackground
            source={require('../../../assets/img/Img_11.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay} />


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
                                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                            }}
                        >
                            <Text style={styles.buttonModalText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de vencimiento del código */}
            <Modal
                visible={isModalVencimientoVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡EL CÓDIGO HA VENCIDO!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>El código que le enviamos ha vencido, le enviaremos uno nuevo.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => setIsModalVencimientoVisible(false)}
                        >
                            <Text style={styles.buttonModalText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de validación de código */}
            <Modal
                visible={isModalValidacionVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡EL CÓDIGO NO COINCIDE!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>El código ingresado no coincide. Por favor, ingréselo correctamente.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => setIsModalValidacionVisible(false)}
                        >
                            <Text style={styles.buttonModalText}>Aceptar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de intentos agotados */}
            <Modal
                visible={isModalAgotadoVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => { }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Título del modal */}
                        <Text style={styles.titleModal}>¡DEMASIADOS INTENTOS!</Text>
                        {/* Descripción del modal */}
                        <Text style={styles.descriptionModal}>Ha realizado demasiados intentos. Por favor, intente más tarde.</Text>
                        {/* Logo Decorativo */}
                        <Image
                            source={require('../../../assets/img/logo.png')}
                            style={styles.logoModal}
                        />
                        {/* Botón de acción */}
                        <Pressable
                            style={styles.buttonModal}
                            onPress={() => {
                                setIsModalAgotadoVisible(false);
                                navigation.replace("Login");
                            }}
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
                    <Text style={styles.title}>VERIFICACIÓN DE CREDENCIALES</Text>
                    <Text style={styles.subtitle}>
                        Se ha enviado un código de verificación al correo:{"\n"}
                        <Text style={styles.masked}>{enmascararCorreo(correoUsuario)}</Text>
                    </Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={ref => inputsRef.current[index] = ref}
                                style={styles.otpInput}
                                keyboardType="numeric"
                                maxLength={1}
                                placeholder="*"
                                placeholderTextColor="#aaa"
                                onChangeText={text => handleChange(text, index)}
                                value={digit}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleVerify}
                    >
                        <Text style={styles.buttonText}>Verificar</Text>
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
        paddingTop: 70, // 👈 le da espacio para que no choque con el logo
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

    otpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap", // ✅ ahora se adapta a pantallas pequeñas
        width: "100%",
        marginBottom: 30,
    },

    otpInput: {
        width: 45, // un poco más estrecho
        height: 60,
        backgroundColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        textAlign: "center",
        fontSize: 22,
        color: "#000",
        margin: 5, // reemplaza gap con margin
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

export default VerificacionRegistro;