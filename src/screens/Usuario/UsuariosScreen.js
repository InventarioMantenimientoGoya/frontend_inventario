import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { DrawerActions } from '@react-navigation/native';

import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const UsuariosScreen = () => {

    const navigation = useNavigation();

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
                <Text style={styles.title}>GESTIÓN DE USUARIOS</Text>

                <View style={styles.filters}>
                    <TextInput style={styles.input} placeholder="NOMBRE" />
                    <TextInput style={styles.input} placeholder="APELLIDO" />
                    <TextInput style={styles.input} placeholder="E-MAIL" />
                    <TextInput style={styles.input} placeholder="TELÉFONO" />
                    <TextInput style={styles.input} placeholder="CARGO" />
                    <TextInput style={styles.input} placeholder="AREA" />
                    <TextInput style={styles.input} placeholder="ROL" />
                    <TextInput style={styles.input} placeholder="ESTADO" />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconButtonContent}>
                            <Ionicons name="person-add" size={18} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Registrar</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconButtonContent}>
                            <Ionicons name="create" size={18} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Editar</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconButtonContent}>
                            <Ionicons name="save" size={18} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Grabar</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconButtonContent}>
                            <Ionicons name="close-circle" size={18} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </View>
                    </TouchableOpacity>
                </View>



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
    backButton: {
        position: 'absolute',
        top: 10,
        left: 20,
        zIndex: 10,
        backgroundColor: '#dfdfdf',
        padding: 2,
        borderRadius: 20,
        elevation: 1,
    },
    logoContainer: {
        alignSelf: 'flex-end',
        paddingRight: 30,
        marginBottom: 10,
    },
    logo: {
        position: 'absolute', // Colocamos el logo en una posición absoluta
        top: -24, // Distancia desde la parte superior
        right: 6, // Distancia desde la parte derecha
        width: 50,
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
        position: 'static'
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
        marginTop: 5,
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
});

export default UsuariosScreen;