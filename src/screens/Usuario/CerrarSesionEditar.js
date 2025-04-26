import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Modal, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from './AuthService'; // Asegúrate de que la ruta es correcta
import { useWindowDimensions } from 'react-native';

export default function CerrarSesionEditar() {
  const navigation = useNavigation();

  const [isModalCargaVisible, setIsModalCargaVisible] = useState(false);
  const [isModalCerrarVisible, setIsModalCerrarVisible] = useState(false);

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768; // Puedes ajustar este valor si quieres

  useEffect(() => {
    // Mostramos el modal de confirmar cierre de sesión al cargar la pantalla
    setIsModalCerrarVisible(true);
  }, []);

  // Esta función confirma el cierre de sesión
  const confirmarCerrarSesion = async () => {
    try {
      setIsModalCerrarVisible(false);

      // Recuperamos el token almacenado en AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (token) {
        // Llamamos al servicio de logout para invalidar el token
        await AuthService.logout(token);

        // Limpiamos el AsyncStorage
        await AsyncStorage.clear();

        // Redirigimos al usuario a la pantalla de login
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        // Si no hay token guardado, mostramos un error
        setIsModalCargaVisible(true);
        await AsyncStorage.clear();
      }
    } catch (error) {
      setIsModalCargaVisible(true);
      await AsyncStorage.clear();
    }
  };

  // Cuando navegamos hacia atrás, asegúrate de restablecer los modales si se desea
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Cuando la pantalla se vuelve a enfocar, mostrar el modal
      setIsModalCerrarVisible(true);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

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

      {/* Modal de confirmación para cerrar sesión */}
      <Modal
        visible={isModalCerrarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => { }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Título del modal */}
            <Text style={styles.titleModal}>CAMBIO DE CREDENCIALES</Text>

            {/* Descripción del modal */}
            <Text style={styles.descriptionModal}>
              Usted cambio sus credenciales para ingresar al aplicativo, por favor ingrese de nuevo.
            </Text>

            {/* Logo Decorativo */}
            <Image
              source={require('../../../assets/img/logo.png')}
              style={styles.logoModal}
            />

            {/* Botón de acción */}
            <Pressable
              style={styles.buttonModal}
              onPress={confirmarCerrarSesion}
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

