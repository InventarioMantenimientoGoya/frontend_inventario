import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions,
    Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const CategoriaScreen = () => {
    const navigation = useNavigation();
    const [isSmallScreen, setIsSmallScreen] = useState(Dimensions.get('window').width <= 600);
    const [visibleModal, setVisibleModal] = useState(null); // 'mecanico', 'electrico', etc.
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        const handleResize = () => {
            const newWidth = Dimensions.get('window').width;
            setIsSmallScreen(newWidth <= 600);
        };

        const subscription = Dimensions.addEventListener('change', handleResize);
        return () => subscription.remove();
    }, []);

    const openModal = (key) => {
        setVisibleModal(key);
    };

    const closeModal = () => {
        setVisibleModal(null);
    };

    const renderModal = (key, title) => (
        <Modal
            transparent
            visible={visibleModal === key}
            animationType="slide"
            onRequestClose={closeModal}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Picker
                        selectedValue={selectedOption}
                        onValueChange={(itemValue) => setSelectedOption(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecciona una opción" value="" />
                        <Picker.Item label="Opción 1" value="opcion1" />
                        <Picker.Item label="Opción 2" value="opcion2" />
                        <Picker.Item label="Opción 3" value="opcion3" />
                    </Picker>
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={styles.menuButton}
            >
                <Ionicons name="menu" size={30} color="#003366" />
            </TouchableOpacity>

            <View style={[styles.container, { width: isSmallScreen ? '90%' : '80%' }]}>
                <Text style={styles.title}>CATEGORIAS</Text>

                <View style={[styles.cardsContainer, { flexDirection: isSmallScreen ? 'column' : 'row' }]}>

                    {/* Tarjeta 1 */}
                    <View style={[styles.card, { width: isSmallScreen ? '100%' : '42%' }]}>
                        <View style={styles.cardContent}>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>MECÁNICO</Text>
                                <Text style={styles.cardDescription}>Descripción de esta tarjeta.</Text>
                            </View>
                            <Image source={require('../../../assets/img/tornillos.png')} style={styles.cardImage} />
                        </View>
                        <TouchableOpacity style={styles.editButton} onPress={() => openModal('mecanico')}>
                            <Ionicons name="create" size={16} color="#fff" />
                            <Text style={styles.editButtonText}>Editar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tarjeta 2 */}
                    <View style={[styles.card, { width: isSmallScreen ? '100%' : '42%' }]}>
                        <View style={styles.cardContent}>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>ELÉCTRICO</Text>
                                <Text style={styles.cardDescription}>Descripción para esta tarjeta.</Text>
                            </View>
                            <Image source={require('../../../assets/img/taladro.jpg')} style={styles.cardImage} />
                        </View>
                        <TouchableOpacity style={styles.editButton} onPress={() => openModal('electrico')}>
                            <Ionicons name="create" size={16} color="#fff" />
                            <Text style={styles.editButtonText}>Editar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tarjeta 3 */}
                    <View style={[styles.card, { width: isSmallScreen ? '100%' : '42%' }]}>
                        <View style={styles.cardContent}>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>NEUMÁTICO</Text>
                                <Text style={styles.cardDescription}>Descripción para esta tarjeta.</Text>
                            </View>
                            <Image source={require('../../../assets/img/racor.png')} style={styles.cardImage} />
                        </View>
                        <TouchableOpacity style={styles.editButton} onPress={() => openModal('neumatico')}>
                            <Ionicons name="create" size={16} color="#fff" />
                            <Text style={styles.editButtonText}>Editar</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tarjeta 4 */}
                    <View style={[styles.card, { width: isSmallScreen ? '100%' : '42%' }]}>
                        <View style={styles.cardContent}>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>HIDRÁULICO</Text>
                                <Text style={styles.cardDescription}>Descripción para esta tarjeta.</Text>
                            </View>
                            <Image source={require('../../../assets/img/acople.png')} style={styles.cardImage} />
                        </View>
                        <TouchableOpacity style={styles.editButton} onPress={() => openModal('hidraulico')}>
                            <Ionicons name="create" size={16} color="#fff" />
                            <Text style={styles.editButtonText}>Editar</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            {/* Modales por tarjeta */}
            {renderModal('mecanico', 'Editar Mecánico')}
            {renderModal('electrico', 'Editar Eléctrico')}
            {renderModal('neumatico', 'Editar Neumático')}
            {renderModal('hidraulico', 'Editar Hidráulico')}
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
        borderRadius: 12,
        padding: 14,
        maxWidth: 1800,
        elevation: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
        color: "#616060",
    },
    cardsContainer: {
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 30,
        marginTop: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        alignSelf: 'center',
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTextContainer: {
        flex: 1,
        paddingRight: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: '#555',
    },
    cardImage: {
        width: 70,
        height: 70,
        backgroundColor: '#ccc',
    },
    editButton: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007BFF',
        paddingVertical: 8,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#fff',
        marginLeft: 6,
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxWidth: 400,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default CategoriaScreen;
