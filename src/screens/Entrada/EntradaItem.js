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


const FormularioEntrada = () => {

  const navigation = useNavigation();

  const [tipoRepuesto, setTipoRepuesto] = useState('');
  const [Repuestoo, setRepuestoo] = useState('');
  const [caracteristica1, setCaracteristica1] = useState('');
  const [caracteristica2, setCaracteristica2] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [CantidadEntrada, setCantidadEntrada] = useState('');
  const [marca, setMarca] = useState('');
  const [unidadmedida, setUnidadMedida] = useState('');
  const [observaciones, setObservaciones] = useState('');
  
  

  const [tiposRepuesto, setTiposRepuesto] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [areasDestino, setAreasDestino] = useState([]);
  const [unidadesmedida, setUnidadesMedida] = useState([]);

  useEffect(() => {
    // Aquí se realizarían las solicitudes al backend para obtener las opciones
    // Usaré valores de ejemplo, reemplázalos por los datos de tu backend

    setTiposRepuesto(['Repuesto 1', 'Repuesto 2', 'Repuesto 3']);
    setUbicaciones(['Ubicación A', 'Ubicación B', 'Ubicación C']);
    setMarcas(['Marca 1', 'Marca 2', 'Marca 3']);
    setUnidadesMedida(['UNIDADES', 'METROS', 'PAQUETES']);
    setAreasDestino(['Área 1', 'Área 2', 'Área 3']);
  }, []);

  const handleEntrada = () => {
    const confirmarYProcesar = () => {
      Alert.alert(
        'Éxito',
        'Su entrada fue realizada correctamente',
        [{ text: 'OK', onPress: () => {
          navigation.goBack();} }]
      );
    };
  
    if (Platform.OS === 'web') {
      const confirmado = window.confirm('¿Estás seguro que deseas registrar esta entrada?');
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

        <Text style={styles.title}>ENTRADA DE ITEMS</Text>

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
            selectedValue={Repuestoo}
            onValueChange={(itemValue) => setRepuestoo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar Repuesto" value="" />
            {/* Puedes llenar esta lista según tus necesidades o el backend */}
            <Picker.Item label="Repuesto 1" value="repuesto1" />
            <Picker.Item label="Repuesto 2" value="repuesto2" />
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

          <Picker
            selectedValue={caracteristica1}
            onValueChange={(itemValue) => setCaracteristica1(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar Caracteristica 1" value="" />
            {/* Puedes llenar esta lista según tus necesidades o el backend */}
            <Picker.Item label="Carac 1" value="carac1" />
            <Picker.Item label="Carac 2" value="carac2" />
          </Picker>
          
          <Picker
            selectedValue={caracteristica2}
            onValueChange={(itemValue) => setCaracteristica2(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar Caracteristica 2" value="" />
            {/* Puedes llenar esta lista según tus necesidades o el backend */}
            <Picker.Item label="Carac 2" value="carac2" />
            <Picker.Item label="Carac 2" value="carac2" />
          </Picker>

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


          <TextInput
            style={styles.input}
            placeholder="CANTIDAD DE ENTRADA"
            keyboardType="numeric"
            value={CantidadEntrada}
            onChangeText={setCantidadEntrada}
            
          />

          
        </View>

        {/* Fila 3 */}
        <View style={styles.row}>
          <Picker
            selectedValue={unidadmedida}
            onValueChange={(itemValue) => setUnidadMedida(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar Unidad de Medida" value="" />
            {unidadesmedida.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>

          
        </View>

        {/* Fila 4 */}
        <TextInput
          style={[styles.input]}
          placeholder="OBSERVACIONES"
          value={observaciones}
          onChangeText={setObservaciones}
        />

        
        

        {/* Botón */}
        <TouchableOpacity style={styles.button} onPress={handleEntrada}>
          <Text style={styles.buttonText}>ENTRADA</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FormularioEntrada;

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