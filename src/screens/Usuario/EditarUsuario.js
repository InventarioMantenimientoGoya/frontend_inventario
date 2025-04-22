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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/globalStyles';
import * as ImagePicker from 'expo-image-picker';

const EditarUsuario = () => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions(); // 📏 Detecta el ancho de la pantalla

    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [imagen, setImagen] = useState(require("../../../assets/img/Img_6.png"));
    const [imagenPersonalizada, setImagenPersonalizada] = useState(null);


    const handleAgregar = () => {
        const confirmarYProcesar = () => {
            Alert.alert(
                'Éxito',
                'Su entrada fue realizada correctamente',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        };

        if (Platform.OS === 'web') {
            const confirmado = window.confirm('¿Estás seguro que deseas agregar este item?');
            if (confirmado) {
                confirmarYProcesar();
            }
        } else {
            Alert.alert(
                'Confirmar entrada',
                '¿Estás seguro que deseas registrar esta entrada?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Sí', onPress: confirmarYProcesar },
                ],
                { cancelable: false }
            );
        }
    };

    const handleTelefonoChange = (text) => {
        const numeros = text.replace(/[^0-9]/g, '');
        setTelefono(numeros);
    };

    const handleCorreoChange = (text) => {
        setCorreo(text);
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

    const isFormValid = password.length >= 8 && password === confirmarPassword;

    const isSmallScreen = width < 600;

    const seleccionarImagen = async () => {
        let resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!resultado.canceled) {
            setImagenPersonalizada(resultado.assets[0].uri);
        }
    };

    const cancelarImagen = () => {
        setImagenPersonalizada(null);
    };


    return (
        <ImageBackground
            source={require('../../../assets/img/Img_9.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.overlay} />

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
                                    <TextInput style={styles.input} placeholder="Nombres" />
                                </View>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <TextInput style={styles.input} placeholder="Apellidos" />
                                </View>
                            </View>

                            <View style={[styles.row, isSmallScreen && styles.column]}>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Correo Electrónico"
                                        value={correo}
                                        onChangeText={handleCorreoChange}
                                        keyboardType="email-address"
                                    />
                                </View>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Teléfono (60 - +57)"
                                        value={telefono}
                                        onChangeText={handleTelefonoChange}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={[styles.row, isSmallScreen && styles.column]}>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <TextInput style={styles.input} placeholder="Cargo" />
                                </View>
                                <View style={[styles.inputGroup, isSmallScreen ? styles.fullWidth : styles.halfWidth]}>
                                    <TextInput style={styles.input} placeholder="Área" />
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
                                onPress={handleAgregar}
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
    }
});

export default EditarUsuario;
