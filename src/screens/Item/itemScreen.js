import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Datos originales sin descripción generada
const rawItemData = [
  { id: '01', Rep_categoria: 'Mecánico', Rep_nombre: 'Tornillo ', Rep_caracteristica1: 'ALLEN BRISTOL', Rep_caracteristica2: 'M6 X 25mm', descripcion: '', Rep_marca: '', Rep_stock_inicial: 10, Rep_unidad_medida: 'UNIDADES', Rep_ubicacion: 'B2', Rep_stock_minimo: 2, Rep_stock: '5', Rep_costo_unitario: '10.000', Rep_costo_total: '100.000', Rep_observaciones: 'Ninguna', imagen: "" },
  { id: '02', Rep_categoria: 'Mecánico', Rep_nombre: 'Tornillo ', Rep_caracteristica1: 'ALLEN BRISTOL', Rep_caracteristica2: 'M3 X 10mm', descripcion: '', Rep_marca: '', Rep_stock_inicial: 10, Rep_unidad_medida: 'UNIDADES', Rep_ubicacion: 'B2', Rep_stock_minimo: 2, Rep_stock: '5', Rep_costo_unitario: '10.000', Rep_costo_total: '100.000', Rep_observaciones: 'Ninguna', imagen: "" },
  { id: '03', Rep_categoria: 'Mecánico', Rep_nombre: 'Tornillo ', Rep_caracteristica1: 'ALLEN BRISTOL', Rep_caracteristica2: 'M4 X 15mm', descripcion: '', Rep_marca: '', Rep_stock_inicial: 10, Rep_unidad_medida: 'UNIDADES', Rep_ubicacion: 'B2', Rep_stock_minimo: 2, Rep_stock: '5', Rep_costo_unitario: '10.000', Rep_costo_total: '100.000', Rep_observaciones: 'Ninguna', imagen: "" },
  { id: '04', Rep_categoria: 'Mecánico', Rep_nombre: 'Tornillo ', Rep_caracteristica1: 'ALLEN BRISTOL', Rep_caracteristica2: 'M5 X 5mm', descripcion: '', Rep_marca: '', Rep_stock_inicial: 10, Rep_unidad_medida: 'UNIDADES', Rep_ubicacion: 'C2', Rep_stock_minimo: 2, Rep_stock: '5', Rep_costo_unitario: '10.000', Rep_costo_total: '100.000', Rep_observaciones: 'Ninguna' },
  { id: '05', Rep_categoria: 'Mecánico', Rep_nombre: 'Tornillo ', Rep_caracteristica1: 'ALLEN BRISTOL', Rep_caracteristica2: 'M8 X 20mm', descripcion: '', Rep_marca: '', Rep_stock_inicial: 10, Rep_unidad_medida: 'UNIDADES', Rep_ubicacion: 'C3', Rep_stock_minimo: 2, Rep_stock: '5', Rep_costo_unitario: '10.000', Rep_costo_total: '100.000', Rep_observaciones: 'Ninguna' },
  { id: '06', Rep_categoria: 'Mecánico', Rep_nombre: 'Tornillo ', Rep_caracteristica1: 'ALLEN BRISTOL', Rep_caracteristica2: 'M10 X 50mm', descripcion: '', Rep_marca: '', Rep_stock_inicial: 10, Rep_unidad_medida: 'UNIDADES', Rep_ubicacion: 'D2', Rep_stock_minimo: 2, Rep_stock: '5', Rep_costo_unitario: '10.000', Rep_costo_total: '100.000', Rep_observaciones: 'Ninguna' },
  { id: '07', Rep_categoria: 'Mecánico', Rep_nombre: 'Tornillo ', Rep_caracteristica1: 'ALLEN BRISTOL', Rep_caracteristica2: 'M12 X 30mm', descripcion: '', Rep_marca: '', Rep_stock_inicial: 10, Rep_unidad_medida: 'UNIDADES', Rep_ubicacion: 'A10', Rep_stock_minimo: 2, Rep_stock: '5', Rep_costo_unitario: '10.000', Rep_costo_total: '100.000', Rep_observaciones: 'Ninguna' },
  { id: '08', Rep_categoria: 'Mecánico', Rep_nombre: 'Tornillo ', Rep_caracteristica1: 'ALLEN BRISTOL', Rep_caracteristica2: 'M5 X 15mm', descripcion: '', Rep_marca: '', Rep_stock_inicial: 10, Rep_unidad_medida: 'UNIDADES', Rep_ubicacion: 'D25', Rep_stock_minimo: 2, Rep_stock: '5', Rep_costo_unitario: '10.000', Rep_costo_total: '100.000', Rep_observaciones: 'Ninguna' },
  { id: '09', Rep_categoria: 'Mecánico', Rep_nombre: 'Tornillo ', Rep_caracteristica1: 'ALLEN BRISTOL', Rep_caracteristica2: 'M14 X 90mm', descripcion: '', Rep_marca: '', Rep_stock_inicial: 10, Rep_unidad_medida: 'UNIDADES', Rep_ubicacion: 'A13', Rep_stock_minimo: 2, Rep_stock: '5', Rep_costo_unitario: '10.000', Rep_costo_total: '100.000', Rep_observaciones: 'Ninguna' },
  { id: '10', Rep_categoria: 'Mecánico', Rep_nombre: 'Tornillo ', Rep_caracteristica1: 'ALLEN BRISTOL', Rep_caracteristica2: 'M6 X 10mm ', descripcion: '', Rep_marca: '', Rep_stock_inicial: 10, Rep_unidad_medida: 'UNIDADES', Rep_ubicacion: 'D1', Rep_stock_minimo: 2, Rep_stock: '5', Rep_costo_unitario: '10.000', Rep_costo_total: '100.000', Rep_observaciones: 'Ninguna' },
];

// Generar itemData con la descripción concatenada
const itemData = rawItemData.map(item => ({
  ...item,
  descripcion: `${item.Rep_caracteristica1} - ${item.Rep_caracteristica2}`,
}));


const ItemScreen = () => {
  const navigation = useNavigation();

  const [filters, setFilters] = useState({
    Rep_categoria: '',
    Rep_caracteristica1: '',
    Rep_caracteristica2: '',
    Rep_nombre: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('');

  // Obtiene valores unicos para cada uno de los filtros:)
  const filterOptions = useMemo(() => ({
    Rep_categoria: [...new Set(itemData.map(item => item.Rep_categoria))],
    Rep_caracteristica1: [...new Set(itemData.map(item => item.Rep_caracteristica1))],
    Rep_caracteristica2: [...new Set(itemData.map(item => item.Rep_caracteristica2))],
    Rep_nombre: [...new Set(itemData.map(item => item.Rep_nombre))],
  }), []);

  // Filtra los datos segun los filtros seleccionados
  const filteredData = useMemo(() => {
    return itemData.filter(item => {
      return (
        (!filters.Rep_categoria || item.Rep_categoria === filters.Rep_categoria) &&
        (!filters.Rep_caracteristica1 || item.Rep_caracteristica1 === filters.Rep_caracteristica1) &&
        (!filters.Rep_caracteristica2 || item.Rep_caracteristica2 === filters.Rep_caracteristica2) &&
        (!filters.Rep_nombre || item.Rep_nombre === filters.Rep_nombre)
      );
    });
  }, [filters]);

  const openFilterModal = (filterType) => {
    setCurrentFilter(filterType);
    setModalVisible(true);
  };

  const FilterButton = ({ title, value, onPress }) => (
    <TouchableOpacity
      style={[styles.filterButton, value ? styles.filterButtonActive : null]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, value ? styles.filterButtonTextActive : null]}>
        {value || title}
      </Text>
      <Ionicons
        name={value ? "close-circle" : "chevron-down"}
        size={20}
        color={value ? "#007BFF" : "#666"}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.menuButton}>
        <Ionicons name="menu" size={30} color="#003366" />
      </TouchableOpacity>
      <View style={styles.container}>



        {/* Botón azul en la parte superior derecha */}
        {/*         <TouchableOpacity
          style={styles.blueButton}
          onPress={() => navigation.navigate('Agregar_Item')}
        >
          <Text style={styles.blueButtonText}>Agregar Item</Text>
        </TouchableOpacity> */}

        <Image
          source={require("../../../assets/img/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>BUSQUEDA ITEMS</Text>

        <View style={styles.filters}>
          <FilterButton
            title="TIPO DE REPUESTO"
            value={filters.Rep_categoria}
            onPress={() => openFilterModal('Rep_categoria')}
          />
          <FilterButton
            title="CARACTERÍSTICA 1"
            value={filters.Rep_caracteristica1}
            onPress={() => openFilterModal('Rep_caracteristica1')}
          />
          <FilterButton
            title="CARACTERÍSTICA 2"
            value={filters.Rep_caracteristica2}
            onPress={() => openFilterModal('Rep_caracteristica2')}
          />
          <FilterButton
            title="NOMBRE DEL REPUESTO"
            value={filters.Rep_nombre}
            onPress={() => openFilterModal('Rep_nombre')}
          />
        </View>

        {/* Tabla de item */}
        <View style={styles.tableContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <View style={styles.tableHeader}>
                <Text style={styles.th}>ID</Text>
                <Text style={styles.th}>TIPO DE REPUESTO</Text>
                <Text style={styles.th}>REPUESTO</Text>
                <Text style={styles.th}>CARACTERÍSTICA 1</Text>
                <Text style={styles.th}>CARACTERÍSTICA 2</Text>
                <Text style={styles.th}>DESCRIPCIÓN</Text>
                <Text style={styles.th}>MARCA</Text>
                <Text style={styles.th}>STOCK INICIAL</Text>
                <Text style={styles.th}>UNIDAD MEDIDA</Text>
                <Text style={styles.th}>UBICACIÓN</Text>
                <Text style={styles.th}>STOCK MINIMO</Text>
                <Text style={styles.th}>STOCK</Text>
                <Text style={styles.th}>COSTO UNITARIO</Text>
                <Text style={styles.th}>COSTO TOTAL</Text>
                <Text style={styles.th}>OBSERVACIONES</Text>
                <Text style={styles.th}>IMAGEN</Text>
              </View>

              <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={true}>
                {filteredData.map((item, index) => (
                  <View style={styles.row} key={index}>
                    <Text style={styles.td}>{item.id}</Text>
                    <Text style={styles.td}>{item.Rep_categoria}</Text>
                    <Text style={styles.td}>{item.Rep_nombre}</Text>
                    <Text style={styles.td}>{item.Rep_caracteristica1}</Text>
                    <Text style={styles.td}>{item.Rep_caracteristica2}</Text>
                    <Text style={styles.td}>{item.descripcion}</Text>
                    <Text style={styles.td}>{item.Rep_marca}</Text>
                    <Text style={styles.td}>{item.Rep_stock_inicial}</Text>
                    <Text style={styles.td}>{item.Rep_unidad_medida}</Text>
                    <Text style={styles.td}>{item.Rep_ubicacion}</Text>
                    <Text style={styles.td}>{item.Rep_stock_minimo}</Text>
                    <Text style={styles.td}>{item.Rep_stock}</Text>
                    <Text style={styles.td}>{item.Rep_costo_unitario}</Text>
                    <Text style={styles.td}>{item.Rep_costo_total}</Text>
                    <Text style={styles.td}>{item.Rep_observaciones}</Text>
                    <Text style={styles.td}>{item.imagen}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>


        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton}
            onPress={() => navigation.navigate('Agregar_Item')}
          >
            <View style={styles.iconButtonContent}>
              <Ionicons name="save" size={18} color="#fff" style={styles.icon} />

              <Text style={styles.buttonText}>Agregar Item</Text>
            </View>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {currentFilter === 'Rep_categoria' ? 'Seleccionar Tipo de Repuesto' :
                      currentFilter === 'Rep_caracteristica1' ? 'Seleccionar Característica 1' :
                        currentFilter === 'Rep_caracteristica2' ? 'Seleccionar Característica 2' :
                          'Seleccionar Repuesto'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setFilters(prev => ({ ...prev, [currentFilter]: '' }));
                      setModalVisible(false);
                    }}
                    style={styles.clearButton}
                  >
                    <Text style={styles.clearButtonText}>Limpiar</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={filterOptions[currentFilter]}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setFilters(prev => ({ ...prev, [currentFilter]: item }));
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />

                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeModalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>




        </View>

      </View>
    </ScrollView>
  );
};

export default ItemScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#dfdfdf',
    paddingVertical: 40,
    paddingTop: 90,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
    elevation: 3,
  },
  logoContainer: {
    alignSelf: 'flex-end',
    paddingRight: 30,
    marginBottom: 10,
  },
  logo: {
    position: 'absolute', // Colocamos el logo en una posición absoluta
    top: -20, // Distancia desde la parte superior
    right: 10, // Distancia desde la parte derecha
    width: 65,
    height: 100,
    resizeMode: 'contain',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    width: width > 600 ? '80%' : '90%',
    maxWidth: 1800,
    elevation: 4,
  },
  blueButton: {
    position: 'absolute',
    top: 490,
    right: 16,
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    zIndex: 1,
  },
  blueButtonText: {
    color: '#fff',
    fontSize: 14,

  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: "#616060",
  },

  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    padding: 10,
    flexGrow: 1,
    minWidth: '45%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007BFF',
  },
  filterButtonText: {
    color: '#858484',
    flex: 1,
  },
  filterButtonTextActive: {
    color: '#007BFF',
  },
  input: {
    backgroundColor: '#EAEAEA',
    borderRadius: 8,
    padding: 10,
    flexGrow: 1,
    minWidth: '45%',
    marginBottom: 10,
    placeholderTextColor: '#858484', // Color del placeholder para todos los TextInput
    borderWidth: 1, // ← esta línea agrega el borde
    borderColor: "#ccc", // ← puedes cambiar este color a tu gusto
  },

  tableContainer: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    flex: 1, // Permite que la tabla ocupe el espacio disponible sin empujar el botón

  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  th: {
    width: 224,
    color: '#fff',
    // fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tableBody: {
    maxHeight: 200,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 8,
    alignItems: 'center',
  },
  td: {
    width: 224,
    fontSize: 14,
    textAlign: 'center',
  },

  salidaButton: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  salidaText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 12,
    zIndex: 10,
  },

  buttonContainer: {
    flexDirection: width > 600 ? 'row' : 'column', // Fila en pantallas grandes, columna en pantallas pequeñas
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15, // Espacio entre botones
    marginTop: 20,
    flexWrap: 'wrap',
    width: '100%', // Asegura que el contenedor ocupe el 100% del ancho
  },

  actionButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120, // Asegura un tamaño mínimo para los botones
    alignItems: 'center',
    width: width > 600 ? 'auto' : '100%', // En pantallas grandes, los botones no ocupan el 100% del ancho; en pantallas pequeñas sí
    marginBottom: width <= 600 ? 0 : 0, // Añadir margen en pantallas pequeñas, en grandes no se necesita
  },


  buttonText: {
    color: '#fff',
  },

  // Estilos de los Iconos en los botones
  iconButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: '#007BFF',
    fontSize: 14,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeModalButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
