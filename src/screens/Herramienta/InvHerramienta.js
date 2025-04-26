import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const rawItemData = [
  {id: '1', Her_categoria: 'Mecánico', Her_nombre: 'HOMBRE SOLO', Her_caracteristica1: '10"', Her_caracteristica2: '', descripcion: '', Her_marca: '', Her_stock_inicial: '1', Her_unidad_medida: 'UNIDADES', Her_ubicacion: 'HE03', Her_stock_minimo: '1', Her_stock: '1', Her_costo_unitario: '150.000', Her_costo_total: '150.000', Her_observaciones: 'Ninguna'},
  {id: '2', Her_categoria: 'Mecánico', Her_nombre: 'TALADRO', Her_caracteristica1: '3/8"', Her_caracteristica2: '', descripcion: '', Her_marca: '', Her_stock_inicial:'2', Her_unidad_medida: 'UNIDADES', Her_ubicacion: 'HE03', Her_stock_minimo: '1', Her_stock: '2', Her_costo_unitario: '150.000', Her_costo_total: '300.000', Her_observaciones: 'Ninguna'},
  {id: '3', Her_categoria: 'Mecánico', Her_nombre: 'BROCA', Her_caracteristica1: '1/4"', Her_caracteristica2: '', descripcion: '', Her_marca: '', Her_stock_inicial: '3', Her_unidad_medida:'UNIDADES', Her_ubicacion: 'HE03', Her_stock_minimo: '1', Her_stock: '3', Her_costo_unitario: '150.000', Her_costo_total: '450.000', Her_observaciones: 'Ninguna'},
  {id: '4', Her_categoria: 'Eléctrico', Her_nombre: 'MULTIMETRO', Her_caracteristica1: 'UT33C+', Her_caracteristica2: '', descripcion: '', Her_marca: '', Her_stock_inicial: '4', Her_unidad_medida: 'UNIDADES', Her_ubicacion: 'HE03', Her_stock_minimo: '1', Her_stock: '4', Her_costo_unitario: '150.000', Her_costo_total: '600.000', Her_observaciones: 'Ninguna'},
  {id: '5', Her_categoria: 'Eléctrico', Her_nombre: 'PINZA PERIMETRICA', Her_caracteristica1: '', Her_caracteristica2: '', descripcion: '', Her_marca: '', Her_stock_inicial: '5', Her_unidad_medida: 'UNIDADES', Her_ubicacion: 'HE03', Her_stock_minimo: '1', Her_stock: '5', Her_costo_unitario: '150.000', Her_costo_total: '750.000', Her_observaciones: 'Ninguna'},
  {id: '6', Her_categoria: 'Mecánico', Her_nombre: 'LLAVE', Her_caracteristica1: '12mm', Her_caracteristica2: '', descripcion: '', Her_marca: '', Her_stock_inicial: '6', Her_unidad_medida:'UNIDADES', Her_ubicacion: 'HE03', Her_stock_minimo: '1', Her_stock: '6', Her_costo_unitario: '150.000', Her_costo_total: '900.000', Her_observaciones: 'Ninguna'},
  {id: '7', Her_categoria: 'Mecánico', Her_nombre: 'FLEXOMETRO', Her_caracteristica1: '5 mts', Her_caracteristica2: '', descripcion: '', Her_marca: '', Her_stock_inicial: '7', Her_unidad_medida:'UNIDADES', Her_ubicacion: 'HE03', Her_stock_minimo: '1', Her_stock: '7', Her_costo_unitario: '150.000', Her_costo_total: '1.050.000', Her_observaciones: 'Ninguna'},
  {id: '8', Her_categoria: 'Mecánico', Her_nombre: 'MARTILLO', Her_caracteristica1: 'DE GOMA', Her_caracteristica2: '', descripcion: '', Her_marca: '', Her_stock_inicial: '8', Her_unidad_medida:'UNIDADES', Her_ubicacion: 'HE03', Her_stock_minimo: '1', Her_stock: '8', Her_costo_unitario: '150.000', Her_costo_total: '1.200.000', Her_observaciones: 'Ninguna'},
];

const InvHerramienta = () => {

  const itemData = rawItemData.map(item => ({
    ...item,
    descripcion: `${item.Her_caracteristica1} - ${item.Her_caracteristica2}`,
  }));

  const navigation = useNavigation();


  const [filters, setFilters] = useState({
    Her_categoria: '',
    Her_caracteristica1: '',
    Her_caracteristica2: '',
    Her_nombre: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('');

  // Get unique values for each filter
  const filteredForOptions = useMemo(() => {
      return itemData.filter(item => {
        return (
          (!filters.Her_categoria || item.Her_categoria === filters.Her_categoria) &&
          (!filters.Her_caracteristica1 || item.Her_caracteristica1 === filters.Her_caracteristica1) &&
          (!filters.Her_caracteristica2 || item.Her_caracteristica2 === filters.Her_caracteristica2) &&
          (!filters.Her_nombre || item.Her_nombre === filters.Her_nombre)
        );
      });
    }, [filters]);

    const filterOptions = useMemo(() => ({
      Her_categoria: [...new Set(itemData.map(item => item.Her_categoria))],
      Her_caracteristica1: [...new Set(filteredForOptions.map(item => item.Her_caracteristica1))],
      Her_caracteristica2: [...new Set(filteredForOptions.map(item => item.Her_caracteristica2))],
      Her_nombre: [...new Set(filteredForOptions.map(item => item.Her_nombre))],
    }), [filteredForOptions]);

    const filteredData = useMemo(() => {
      return itemData.filter(item => {
        return (
          (!filters.Her_categoria || item.Her_categoria === filters.Her_categoria) &&
          (!filters.Her_caracteristica1 || item.Her_caracteristica1 === filters.Her_caracteristica1) &&
          (!filters.Her_caracteristica2 || item.Her_caracteristica2 === filters.Her_caracteristica2) &&
          (!filters.Her_nombre || item.Her_nombre === filters.Her_nombre)
        );
      });
    }, [filters]);

  const openFilterModal = (filterType) => {
    setCurrentFilter(filterType);
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={styles.menuButton}>
        <Ionicons name="menu" size={30} color="#003366" />
      </TouchableOpacity>
      <View style={styles.container}>
        <Image
          source={require("../../../assets/img/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>INVENTARIO HERRAMIENTA</Text>

        <View style={styles.filters}>
          <FilterButton
            title="TIPO DE HERRAMIENTA"
            value={filters.Her_categoria}
            onPress={() => openFilterModal('Her_categoria')}
          />
          <FilterButton
            title="CARACTERÍSTICA 1"
            value={filters.Her_caracteristica1}
            onPress={() => openFilterModal('Her_caracteristica1')}
          />
          <FilterButton
            title="CARACTERÍSTICA 2"
            value={filters.Her_caracteristica2}
            onPress={() => openFilterModal('Her_caracteristica2')}
          />
          <FilterButton
            title="HERRAMIENTA"
            value={filters.Her_nombre}
            onPress={() => openFilterModal('Her_nombre')}
          />
        </View>

        <View style={styles.tableContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <View style={styles.tableHeader}>
                <Text style={styles.th}>ID</Text>
                <Text style={styles.th}>TIPO DE HERRAMIENTA</Text>
                <Text style={styles.th}>HERRAMIENTA</Text>
                <Text style={styles.th}>CARACTERÍSTICA 1</Text>
                <Text style={styles.th}>CARACTERÍSTICA 2</Text>
                <Text style={styles.th}>DESCRIPCIÓN</Text>
                <Text style={styles.th}>MARCA</Text>
                <Text style={styles.th}>STOCK INICIAL</Text>
                <Text style={styles.th}>UNIDAD DE MEDIDA</Text>
                <Text style={styles.th}>UBICACIÓN</Text>
                <Text style={styles.th}>OBSERVACIONES</Text>
                <Text style={styles.th}>STOCK MINIMO</Text>
                <Text style={styles.th}>STOCK</Text>
                <Text style={styles.th}>COSTO UNITARIO</Text>
                <Text style={styles.th}>COSTO TOTAL</Text>
                <Text style={styles.th}>OBSERVACIONES</Text>
              </View>

              <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={true}>
                {filteredData.map((item, index) => (
                  <View style={styles.row} key={index}>
                    <Text style={styles.td}>{item.id}</Text>
                    <Text style={styles.td}>{item.Her_categoria}</Text>
                    <Text style={styles.td}>{item.Her_nombre}</Text>
                    <Text style={styles.td}>{item.Her_caracteristica1}</Text>
                    <Text style={styles.td}>{item.Her_caracteristica2}</Text>
                    <Text style={styles.td}>{item.descripcion}</Text>
                    <Text style={styles.td}>{item.Her_marca}</Text>
                    <Text style={styles.td}>{item.Her_stock_inicial}</Text>
                    <Text style={styles.td}>{item.Her_unidad_medida}</Text>
                    <Text style={styles.td}>{item.Her_ubicacion}</Text>
                    <Text style={styles.td}>{item.Her_stock_minimo}</Text>
                    <Text style={styles.td}>{item.Her_stock}</Text>
                    <Text style={styles.td}>{item.Her_costo_unitario}</Text>
                    <Text style={styles.td}>{item.Her_costo_total}</Text>
                    <Text style={styles.td}>{item.Her_observaciones}</Text>
                    <Text style={styles.td}>{item.imagen}</Text>
                </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Agregar_Prestamo')}>
            <View style={styles.iconButtonContent}>
              <Ionicons name="save" size={18} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Solicitar Prestamo</Text>
            </View>
          </TouchableOpacity>
        </View>

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
                  {currentFilter === 'Her_categoria' ? 'Seleccionar Tipo de Herramienta' :
                   currentFilter === 'Her_caracteristica1' ? 'Seleccionar Característica 1' :
                   currentFilter === 'Her_caracteristica2' ? 'Seleccionar Característica 2' :
                   'Seleccionar Herramienta'}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#dfdfdf',
    paddingVertical: 40,
    paddingTop: 90,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    width: width > 600 ? '80%' : '90%',
    maxWidth: 1800,
    elevation: 4,
  },
  logo: {
    position: 'absolute',
    top: -20,
    right: 10,
    width: 55,
    height: 100,
    resizeMode: 'contain',
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
  tableContainer: {
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    flex: 1,
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
  buttonContainer: {
    flexDirection: width > 600 ? 'row' : 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginTop: 20,
    flexWrap: 'wrap',
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    width: width > 600 ? 'auto' : '100%',
    marginBottom: width <= 600 ? 0 : 0,
  },
  buttonText: {
    color: '#ffffff',
  },
  iconButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    right: -63,
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 12,
    zIndex: 10,
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

export default InvHerramienta;