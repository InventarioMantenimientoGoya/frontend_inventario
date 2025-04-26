// components/AuthGuard.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Modal, Text, Image, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { urlApi } from "../../../constants";

export default function AuthGuard({ children }) {
    const [isModalCargaVisible, setIsModalCargaVisible] = useState(false);
    const [checking, setChecking] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const validarAuth = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    // Limpiamos el AsyncStorage
                    setChecking(true);
                    setIsModalCargaVisible(true);

                }

                const response = await fetch(urlApi); // Usa tu endpoint real
                if (!response.ok) {
                    // Limpiamos el AsyncStorage
                    setChecking(true);
                    setIsModalCargaVisible(true);

                }
                
                setChecking(false); // ✅ Todo OK, mostrar contenido
            } catch (error) {
                // Limpiamos el AsyncStorage
                setChecking(true);

                setIsModalCargaVisible(true);
            }
        };

        validarAuth();

        // Se configura un intervalo para que la función fetchData se ejecute cada 5 segundos
        const intervalId = setInterval(() => {
            validarAuth();
        }, 5000);

        // Se limpia el intervalo cuando el componente se desmonte para evitar posibles fugas de memoria
        return () => clearInterval(intervalId);
    }, []);

    const borrarToken = async () => {
        await AsyncStorage.clear();
    }

    if (checking) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                {/* Modal de error */}
                <Modal
                    visible={isModalCargaVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => { }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.titleModal}>¡ERROR DE CONEXIÓN!</Text>
                            <Text style={styles.descriptionModal}>
                                Ocurrió un problema al conectar. Por favor, intente más tarde.
                            </Text>
                            <Image
                                source={require('../../../assets/img/logo.png')}
                                style={styles.logoModal}
                            />
                            <Pressable
                                style={styles.buttonModal}
                                onPress={ () => {
                                    borrarToken();
                                    setIsModalCargaVisible(false);
                                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                                }}
                            >
                                <Text style={styles.buttonModalText}>Aceptar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                {/* Solo muestra el loader si no hay error */}
                {!isModalCargaVisible && <ActivityIndicator size="large" color="#003366" />}
            </View>
        );
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
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
        fontSize: 26,
        fontFamily: 'Poppins-Bold',
        color: 'gray',
        marginBottom: 10,
        textAlign: 'center',
    },
    descriptionModal: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
        width: '100%',
    },
    logoModal: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    buttonModal: {
        backgroundColor: '#003366',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 25,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonModalText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: 'white',
    },
});