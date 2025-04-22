import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, Modal, Pressable } from "react-native";
import { COLORS } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUsuarios } from '../../Models/UsuarioModel';
import { verificarPassword } from "./Hash";
import { Transmision } from "./Transmision"
import { suspenderUsuario } from "./FuncionesUsuario";
import { correoUsuarioSuspendido } from "./FuncionesUsuario";

const Login = ({ navigation }) => {

  const [secureTextEntry, setSecureTextEntry] = useState(true); // Estado para manejar la visibilidad de la contraseña
  const [isModalCargaVisible, setIsModalCargaVisible] = useState(false);
  const [isModalContrasenaVisible, setIsModalContrasenaVisible] = useState(false);
  const [isModalSuspensionVisible, setIsModalSuspensionVisible] = useState(false);
  const [isModalInexistenteVisible, setIsModalInexistenteVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [intentosFallidos, setIntentosFallidos] = useState(0);


  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const iniciarSesion = async () => {
    try {
      const usuariosData = await getUsuarios();

      if (!usuariosData || usuariosData.length === 0) {
        setIsModalInexistenteVisible(true);
        return;
      }

      const usuario = usuariosData.find(
        (u) => u.Usu_email?.toLowerCase() === email.toLowerCase()
      );

      if (!usuario) {
        setIsModalInexistenteVisible(true);
        return;
      }

      if (usuario.Usu_estado === false) {
        setIsModalSuspensionVisible(true);
        return;
      }

      // Implementación de la verificación de la contraseña usando el hash
      const contrasenaVerificada = await verificarPassword(password, usuario.Usu_contrasena);

      // Aquí verificamos que la contraseña es correcta (contrasenaVerificada será `true` si es correcta)
      if (!contrasenaVerificada) {
        const nuevosIntentos = intentosFallidos + 1;
        setIntentosFallidos(nuevosIntentos);

        if (nuevosIntentos >= 3) {
          try {
            // Primero, suspendemos al usuario
            const suspenderResultado = await suspenderUsuario(usuario.id);

            // Verificamos si la suspensión fue exitosa
            if (suspenderResultado) {
              // Luego, si la suspensión fue exitosa, enviamos el correo
              await correoUsuarioSuspendido(usuario.Usu_email, false);

              // Finalmente, si todo fue exitoso, mostramos el modal de suspensión
              setIsModalSuspensionVisible(true);
              setIntentosFallidos(0); // Reinicia después de mostrar el modal
            } else {
              // Si no se pudo suspender el usuario, mostramos un error
              throw new Error('Error', 'Hubo un problema al suspender el usuario');
            }
          } catch (error) {
            throw new Error('Error', 'Hubo un error en el proceso');
          }
        } else {
          setIsModalContrasenaVisible(true);
        }

        return; // Salimos si la contraseña es incorrecta
      }


      // Si la contraseña es correcta, seguimos con el flujo normal
      const correoEncriptado = await Transmision.encrypt(usuario.Usu_email);

      const contrasenaEncriptada = await Transmision.encrypt(usuario.Usu_contrasena);


      // Si todo es correcto, reiniciamos el contador de intentos y procedemos a la siguiente pantalla
      setIntentosFallidos(0); // Reinicia contador al hacer login bien
      navigation.navigate('Verificacion_Login', {
        usuarioCorreo: correoEncriptado,
        usuarioContrasena: contrasenaEncriptada,
      });

    } catch (error) {
      // Si ocurre un error en el proceso, mostramos el modal de carga
      setIsModalCargaVisible(true);
    }
  };


  return (
    <ImageBackground
      source={require('../../../assets/img/Img_3.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Fondo difuminado azul */}
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
        visible={isModalContrasenaVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => { }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Título del modal */}
            <Text style={styles.titleModal}>¡CONTRASEÑA INCORRECTA!</Text>
            {/* Descripción del modal */}
            <Text style={styles.descriptionModal}>La contraseña es incorrecta. Por favor, intente de nuevo.</Text>
            {/* Logo Decorativo */}
            <Image
              source={require('../../../assets/img/logo.png')}
              style={styles.logoModal}
            />
            {/* Botón de acción */}
            <Pressable
              style={styles.buttonModal}
              onPress={() => setIsModalContrasenaVisible(false)}
            >
              <Text style={styles.buttonModalText}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal de carga de datos */}
      <Modal
        visible={isModalSuspensionVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => { }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Título del modal */}
            <Text style={styles.titleModal}>¡CUENTA SUSPENDIDA!</Text>
            {/* Descripción del modal */}
            <Text style={styles.descriptionModal}>La cuenta está suspendida. Por favor, comuníquese al correo "proyectoinventariosmantenimien@gmail.com".</Text>
            {/* Logo Decorativo */}
            <Image
              source={require('../../../assets/img/logo.png')}
              style={styles.logoModal}
            />
            {/* Botón de acción */}
            <Pressable
              style={styles.buttonModal}
              onPress={() => setIsModalSuspensionVisible(false)}
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

      <View style={styles.container}>
        <View style={styles.card}>
          <Image source={require("../../../assets/img/logo.png")} style={styles.logo} />
          <Text style={styles.title}>SISTEMA DE GESTIÓN DE INVENTARIO MANTENIMIENTO GOYA (S.G.I.M)</Text>
          <Text style={styles.subtitle}>INICIO DE SESIÓN</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="E-mail"
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Icon name="envelope" size={20} color={"#858484"} style={styles.inputIcon} />
          </View>

          {/* Campo de contraseña con ícono de candado y ojo */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Contraseña"
              style={[styles.input, { paddingRight: 40 }]} // Ajustamos el padding para el ícono del ojo
              secureTextEntry={secureTextEntry}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
              <Icon
                name={secureTextEntry ? "eye" : "eye-slash"}
                size={20}
                color={"#858484"}
              />
            </TouchableOpacity>
            <Icon name="lock" size={20} color={"#858484"} style={styles.inputIcon} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Correo_Recuperacion')}>
            <Text style={styles.linkText}>¿Olvidó su contraseña?</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.button}
            onPress={() => iniciarSesion()}
          >
            <Text style={styles.buttonText}>INGRESAR</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Registro_Usuario')}>
            <Text style={styles.linkText}>¿No tiene cuenta?</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Background de la vista
  background: { flex: 1, width: '100%', height: '100%' },
  // Fondo azul semitransparente
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.primary, opacity: 0.5 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ECECEC",
    width: "90%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    overflow: 'hidden',
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    color: "#616060",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    fontWeight: "bold",
    fontFamily: 'Poppins-Regular',
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
  inputIcon: {
    position: "absolute",
    right: 10,
  },
  eyeIconContainer: {
    position: "absolute",
    right: 40, // Ajuste para que el ojo no se sobreponga con el ícono del candado
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
  },
  buttonText: {
    fontSize: 16, fontFamily: 'Poppins-Medium', color: COLORS.primary
  },
  linkText: {
    marginTop: 10,
    fontSize: 12,
    color: "#555",
    fontFamily: 'Poppins-Italic',
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

export default Login;
