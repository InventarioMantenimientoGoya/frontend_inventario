import { TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Importar Picker
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const FormularioSalida = () => {

  const navigation = useNavigation();

  const [tipoRepuesto, setTipoRepuesto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [cantidadSalida, setCantidadSalida] = useState('');
  const [marca, setMarca] = useState('');
  const [areaDestino, setAreaDestino] = useState('');
  const [maquinaDestino, setMaquinaDestino] = useState('');
  const [motivoSalida, setMotivoSalida] = useState('');

  const [tiposRepuesto, setTiposRepuesto] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [areasDestino, setAreasDestino] = useState([]);

  useEffect(() => {
    // Aquí se realizarían las solicitudes al backend para obtener las opciones
    // Usaré valores de ejemplo, reemplázalos por los datos de tu backend

    setTiposRepuesto(['Repuesto 1', 'Repuesto 2', 'Repuesto 3']);
    setUbicaciones(['Ubicación A', 'Ubicación B', 'Ubicación C']);
    setMarcas(['Marca 1', 'Marca 2', 'Marca 3']);
    setAreasDestino(['Área 1', 'Área 2', 'Área 3']);
  }, []);

  const handleSalida = () => {
    const confirmarYProcesar = () => {
      Alert.alert(
        'Éxito',
        'Su salida fue realizada correctamente',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    };
  
    if (Platform.OS === 'web') {
      const confirmado = window.confirm('¿Estás seguro que deseas registrar esta salida?');
      if (confirmado) {
        confirmarYProcesar();
      } 
    } else {
      Alert.alert(
        'Confirmar salida',
        '¿Estás seguro que deseas registrar esta salida?',
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
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Logo en la parte superior derecha */}
        <Image
          source={require('../../../assets/img/logo.png')}
          style={styles.logoForm}
        />

        <Text style={styles.title}>SALIDA DE ITEM</Text>

        {/* Fila 1 */}
        <View style={styles.row}>
          <Picker
            selectedValue={tipoRepuesto}
            onValueChange={(itemValue) => setTipoRepuesto(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar TIPO DE REPUESTO" value="" />
            {tiposRepuesto.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>

          <Picker
            selectedValue={descripcion}
            onValueChange={(itemValue) => setDescripcion(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar DESCRIPCIÓN" value="" />
            {/* Puedes llenar esta lista según tus necesidades o el backend */}
            <Picker.Item label="Descripción 1" value="descripcion1" />
            <Picker.Item label="Descripción 2" value="descripcion2" />
          </Picker>
        </View>

        {/* Fila 2 */}
        <View style={styles.row}>
          <Picker
            selectedValue={ubicacion}
            onValueChange={(itemValue) => setUbicacion(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar UBICACIÓN" value="" />
            {ubicaciones.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>

          <TextInput
            style={styles.input}
            placeholder="CANTIDAD DE SALIDA"
            keyboardType="numeric"
            value={cantidadSalida}
            onChangeText={setCantidadSalida}
          />
        </View>

        {/* Fila 3 */}
        <View style={styles.row}>
          <Picker
            selectedValue={marca}
            onValueChange={(itemValue) => setMarca(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar MARCA" value="" />
            {marcas.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>
        </View>

        {/* Fila 4 */}
        <TextInput
          style={[styles.input, styles.fullWidthInput]}
          placeholder="MÁQUINA DE DESTINO"
          value={maquinaDestino}
          onChangeText={setMaquinaDestino}
        />

        {}  
        <TextInput
          style={[styles.input, styles.fullWidthInput]}
          placeholder="ÁREA DE DESTINO"
          value={areaDestino}
          onChangeText={setAreaDestino}
        />

        {/* Fila 6 */}
        <TextInput
          style={[styles.input, styles.fullWidthInput]}
          placeholder="MOTIVO DE SALIDA"
          multiline
          value={motivoSalida}
          onChangeText={setMotivoSalida}
        />

        {/* Botón */}
        <TouchableOpacity style={styles.button} onPress={handleSalida}>
          <Text style={styles.buttonText}>SALIDA</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FormularioSalida;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#002F6C',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingLeft: 30,
    marginBottom: 10,
  },
  backArrow: {
    fontSize: 24,
    color: '#fff',
    marginRight: 10,
  },
  container: {
    backgroundColor: '#ECECEC',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    elevation: 5,
  },
  logoForm: {
    position: 'absolute',
    top: -15,
    right: 10,
    width: 65,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    color: '#616060',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'column', // Cambié flexDirection a column para que los Pickers se apilen
    justifyContent: 'flex-start', // Alineación vertical
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    padding: 12,
    flexGrow: 1,
    flexBasis: '100%', // Asegura que los input llenen toda la fila
    borderWidth: 1,
    borderColor: '#C0C0C0',
    color: '#000',
  },
  picker: {
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    flexGrow: 1,
    flexBasis: '100%', // Los Picker ahora ocuparán todo el ancho disponible
    padding: 12,
    borderWidth: 1,
    borderColor: '#C0C0C0',
    color: '#000',
    marginBottom: 12, // Asegura separación entre los Pickers
  },
  fullWidthInput: {
    flexBasis: '100%',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
  },
});
