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
  { fechasalida: '01/04/2025', Rep_categoria: 'Mecánico', Rep_nombre: 'TORNILLO ALLEN BRISTOL', Rep_caracteristica1: 'M6 X 25', Rep_caracteristica2: 'GRADO 8', descripcion: '', marca: '', cantidadsalida: 25, unidadmedida: 'UNIDADES', motivosalida: 'REQUISICIÓN', maquinadestino: 'Inyectora 1', area: 'Inyección' },
  { fechasalida: '02/04/2025', Rep_categoria: 'Eléctrico', Rep_nombre: 'CABLE', Rep_caracteristica1: '16 AWG', Rep_caracteristica2: 'ROJO', descripcion: '', marca: '', cantidadsalida: 50, unidadmedida: 'METROS', motivosalida: 'REQUISICIÓN', maquinadestino: 'Inyectora 1', area: 'Inyección' },
  { fechasalida: '03/04/2025', Rep_categoria: 'Neumático', Rep_nombre: 'RACOR QST', Rep_caracteristica1: 'MANGUERA 12', Rep_caracteristica2: '', descripcion: '', marca: '', cantidadsalida: 12, unidadmedida: 'UNIDADES', motivosalida: 'REQUISICIÓN', maquinadestino: 'Inyectora 1', area: 'Inyección' },
  { fechasalida: '04/04/2025', Rep_categoria: 'Mecánico', Rep_nombre: 'TUERCA', Rep_caracteristica1: 'DE SEGURIDAD', Rep_caracteristica2: 'M10', descripcion: '', marca: '', cantidadsalida: 80, unidadmedida: 'UNIDADES', motivosalida: 'REQUISICIÓN', maquinadestino: 'Inyectora 1', area: 'Inyección' },
  { fechasalida: '05/04/2025', Rep_categoria: 'Eléctrico', Rep_nombre: 'RELÉ TÉRMICO', Rep_caracteristica1: '9A', Rep_caracteristica2: '600V', descripcion: '', marca: '', cantidadsalida: 1, unidadmedida: 'UNIDADES', motivosalida: 'REQUISICIÓN', maquinadestino: 'Inyectora 1', area: 'Inyección' },
  { fechasalida: '06/04/2025', Rep_categoria: 'Neumático', Rep_nombre: 'RACOR QSL', Rep_caracteristica1: 'MANGUERA 16 X 1/2"', Rep_caracteristica2: '', descripcion: '', marca: '', cantidadsalida: 24, unidadmedida: 'UNIDADES', motivosalida: 'REQUISICIÓN', maquinadestino: 'Inyectora 1', area: 'Inyección' },
  { fechasalida: '07/04/2025', Rep_categoria: 'Mecánico', Rep_nombre: 'ARANDELA', Rep_caracteristica1: '3/8"', Rep_caracteristica2: '', descripcion: '', marca: '', cantidadsalida: 60, unidadmedida: 'UNIDADES', motivosalida: 'REQUISICIÓN', maquinadestino: 'Inyectora 1', area: 'Inyección' },
  { fechasalida: '08/04/2025', Rep_categoria: 'Eléctrico', Rep_nombre: 'CABLE', Rep_caracteristica1: '12 AWG', Rep_caracteristica2: 'VERDE', descripcion: '', marca: '', cantidadsalida: 25, unidadmedida: 'METROS', motivosalida: 'REQUISICIÓN', maquinadestino: 'Inyectora 1', area: 'Inyección' },
];

const itemData = rawItemData.map(item => ({
  ...item,
  descripcion: `${item.Rep_caracteristica1} - ${item.Rep_caracteristica2}`,
}));

const SalidaScreen = () => {
  const navigation = useNavigation();

  const [filters, setFilters] = useState({
    Rep_categoria: '',
    Rep_caracteristica1: '',
    Rep_caracteristica2: '',
    Rep_nombre: '',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('');

  const filteredForOptions = useMemo(() => {
    return itemData.filter(item => {
      return (
        (!filters.Rep_categoria || item.Rep_categoria === filters.Rep_categoria) &&
        (!filters.Rep_caracteristica1 || item.Rep_caracteristica1 === filters.Rep_caracteristica1) &&
        (!filters.Rep_caracteristica2 || item.Rep_caracteristica2 === filters.Rep_caracteristica2) &&
        (!filters.Rep_nombre || item.Rep_nombre === filters.Rep_nombre)
      );
    });
  }, [filters]);

  const filterOptions = useMemo(() => ({
    Rep_categoria: [...new Set(itemData.map(item => item.Rep_categoria))],
    Rep_caracteristica1: [...new Set(filteredForOptions.map(item => item.Rep_caracteristica1))],
    Rep_caracteristica2: [...new Set(filteredForOptions.map(item => item.Rep_caracteristica2))],
    Rep_nombre: [...new Set(filteredForOptions.map(item => item.Rep_nombre))],
  }), [filteredForOptions]);

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
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={30} color="#003366" />
      </TouchableOpacity>
      
      <View style={styles.container}>
        <Image
          source={require("../../../assets/img/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>HISTORIAL DE SALIDAS</Text>

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

        <View style={styles.tableContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              <View style={styles.tableHeader}>
                <Text style={styles.th}>FECHA SALIDA</Text>
                <Text style={styles.th}>TIPO REPUESTO</Text>
                <Text style={styles.th}>REPUESTO</Text>
                <Text style={styles.th}>CARACTERÍSTICA 1</Text>
                <Text style={styles.th}>CARACTERÍSTICA 2</Text>
                <Text style={styles.th}>DESCRIPCIÓN</Text>
                <Text style={styles.th}>MARCA</Text>
                <Text style={styles.th}>CANTIDAD SALIDA</Text>
                <Text style={styles.th}>UNIDAD MEDIDA</Text>
                <Text style={styles.th}>MOTIVO DE SALIDA</Text>
                <Text style={styles.th}>MAQUINA DE DESTINO</Text>
                <Text style={styles.th}>ARÉA</Text>
              </View>

              <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
                {filteredData.map((item, index) => (
                  <View style={styles.row} key={index}>
                    <Text style={styles.td}>{item.fechasalida}</Text>
                    <Text style={styles.td}>{item.Rep_categoria}</Text>
                    <Text style={styles.td}>{item.Rep_nombre}</Text>
                    <Text style={styles.td}>{item.Rep_caracteristica1}</Text>
                    <Text style={styles.td}>{item.Rep_caracteristica2}</Text>
                    <Text style={styles.td}>{item.descripcion}</Text>
                    <Text style={styles.td}>{item.marca}</Text>
                    <Text style={styles.td}>{item.cantidadsalida}</Text>
                    <Text style={styles.td}>{item.unidadmedida}</Text>
                    <Text style={styles.td}>{item.motivosalida}</Text>
                    <Text style={styles.td}>{item.maquinadestino}</Text>
                    <Text style={styles.td}>{item.area}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Salida_Item')}
          >
            <View style={styles.iconButtonContent}>
              <Ionicons name="save" size={18} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Realizar Salida</Text>
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
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 12,
    zIndex: 10,
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
    top: -24,
    right: 6,
    width: 50,
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
    overflow: 'hidden',
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
  iconButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
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

export default SalidaScreen;