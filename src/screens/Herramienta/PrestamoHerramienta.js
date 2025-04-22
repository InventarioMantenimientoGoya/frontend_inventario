import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  useWindowDimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importar Picker
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const FormularioPrestamo = () => {

  const navigation = useNavigation();

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 400; // Condición para pantallas pequeñas

  // Estados para almacenar los valores seleccionados
  const [nombreHerramienta, setNombreHerramienta] = useState('');
  const [caracteristica1, setCaracteristica1] = useState('');
  const [caracteristica2, setCaracteristica2] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [marca, setMarca] = useState('');
  const [area, setArea] = useState(''); // Aquí se mantiene como un TextInput normal
  const [maquina, setMaquina] = useState('');
  const [motivo, setMotivo] = useState('');

  // Estados para las opciones de las listas desplegables
  const [herramientas, setHerramientas] = useState([]);
  const [caracteristicas1, setCaracteristicas1] = useState([]);
  const [caracteristicas2, setCaracteristicas2] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [areas, setAreas] = useState([]);

  // Función para obtener datos del backend
  const fetchData = async () => {
    try {
      // Reemplazar estas URL por las de el backend
      const responseHerramienta = await fetch('https://example.com/api/herramientas');
      const responseCaracteristica1 = await fetch('https://example.com/api/caracteristica1');
      const responseCaracteristica2 = await fetch('https://example.com/api/caracteristica2');
      const responseMarcas = await fetch('https://example.com/api/marcas');
      const responseAreas = await fetch('https://example.com/api/areas');

      const dataHerramienta = await responseHerramienta.json();
      const dataCaracteristica1 = await responseCaracteristica1.json();
      const dataCaracteristica2 = await responseCaracteristica2.json();
      const dataMarcas = await responseMarcas.json();
      const dataAreas = await responseAreas.json();

      setHerramientas(dataHerramienta);
      setCaracteristicas1(dataCaracteristica1);
      setCaracteristicas2(dataCaracteristica2);
      setMarcas(dataMarcas);
      setAreas(dataAreas);
    } catch (error) {
      console.error('Error al obtener datos:', error);
      Alert.alert('Error', 'Hubo un problema al cargar los datos.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  

  const mostrarAlerta = () => {
    const confirmarYProcesar = () => {
      Alert.alert(
        'Éxito',
        'Su prestamo fue solicitado correctamente',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    };
  
    if (Platform.OS === 'web') {
      const confirmado = window.confirm('¿Estás seguro que deseas solicitar el siguiente prestamo?');
      if (confirmado) {
        confirmarYProcesar();
      }
    } else {
      Alert.alert(
        'Confirmar prestamo',
        '¿Estás seguro que deseas solicitar este prestamo?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sí', onPress: confirmarYProcesar },
        ],
        { cancelable: false }
      );
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Image source={require('../../../assets/img/logo.png')} style={styles.logoTopBar} />
        </View>

        <Text style={styles.title}>PRÉSTAMO DE HERRAMIENTAS</Text>

        {/* Fila de entradas - 2 columnas */}
        <View style={[styles.row, isSmallScreen && { flexDirection: 'column' }]}>
          <Picker
            selectedValue={nombreHerramienta}
            onValueChange={(itemValue) => setNombreHerramienta(itemValue)}
            style={[styles.input, isSmallScreen && { marginBottom: 10 }]}
          >
            <Picker.Item label="Seleccionar Herramienta" value="" />
            {herramientas.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>

          <Picker
            selectedValue={caracteristica1}
            onValueChange={(itemValue) => setCaracteristica1(itemValue)}
            style={[styles.input, isSmallScreen && { marginBottom: 10 }]}
          >
            <Picker.Item label="Seleccionar Característica 1" value="" />
            {caracteristicas1.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>
        </View>

        <View style={[styles.row, isSmallScreen && { flexDirection: 'column' }]}>
          <Picker
            selectedValue={caracteristica2}
            onValueChange={(itemValue) => setCaracteristica2(itemValue)}
            style={[styles.input, isSmallScreen && { marginBottom: 10 }]}
          >
            <Picker.Item label="Seleccionar Característica 2" value="" />
            {caracteristicas2.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>

          <TextInput
            style={[styles.input, isSmallScreen && { marginBottom: 10 }]}
            placeholder="CANTIDAD"
            keyboardType="numeric"
            value={cantidad}
            onChangeText={setCantidad}
          />
        </View>

        <View style={[styles.row, isSmallScreen && { flexDirection: 'column' }]}>
          <Picker
            selectedValue={marca}
            onValueChange={(itemValue) => setMarca(itemValue)}
            style={[styles.input, isSmallScreen && { marginBottom: 10 }]}
          >
            <Picker.Item label="Seleccionar Marca" value="" />
            {marcas.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>

          {/* Área como un TextInput normal */}
          <TextInput
            style={[styles.input, isSmallScreen && { marginBottom: 10 }]}
            placeholder="ÁREA"
            value={area}
            onChangeText={setArea}
          />
        </View>

        {/* Fila de máquina */}
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="MÁQUINA"
            value={maquina}
            onChangeText={setMaquina}
          />
        </View>

        {/* Fila de motivo */}
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="MOTIVO DE PRÉSTAMO"
            multiline
            value={motivo}
            onChangeText={setMotivo}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={mostrarAlerta}>
            <Text style={styles.saveButtonText}>SOLICITAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default FormularioPrestamo;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#002F6C',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  formContainer: {
    backgroundColor: '#ECECEC',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    elevation: 5,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  backArrow: {
    fontSize: 24,
    color: '#002F6C',
    marginRight: 10,
  },
  logoTopBar: {
    width: 65,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    color: '#616060',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#000',
    placeholderTextColor: '#858484',
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1, // Ensures inputs take equal width
    marginRight: 8, // Adds space between inputs
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
  },
});
