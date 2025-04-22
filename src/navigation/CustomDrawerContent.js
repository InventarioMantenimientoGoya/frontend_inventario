import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { FONTS } from '../styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons'; // Asegúrate de tener instalado react-native-vector-icons
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transmision } from '../screens/Usuario/Transmision';

const CustomDrawerContent = (props) => {

    const navigation = useNavigation();

    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const llamarUsuario = async () => {

            try {
                const usuarioLogueado = await AsyncStorage.getItem('usuario');

                const usuarioDescifrado = await Transmision.decrypt(usuarioLogueado);
                setUsuario(usuarioDescifrado);

            } catch (error) {
                console.error("Error al obtener el usuario:", error);
            }
        };

        llamarUsuario();
    }, []);



    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <ImageBackground
                source={require('../../assets/img/Img_5.jpg')}
                style={styles.header}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editIcon} onPress={() => navigation.navigate('Editar_Usuario')} >
                            <MaterialIcons name="edit" size={20} color="#1F2C73" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                        {usuario ? `${usuario.Usu_nombres} ${usuario.Usu_apellidos}` : ''}
                    </Text>
                    <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
                        {usuario ? usuario.Usu_email : ''}
                    </Text>
                </View>
            </ImageBackground>

            <View style={styles.drawerList}>
                <DrawerItemList {...props} />
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 180,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    overlay: {
        padding: 10,
    },
    avatarContainer: {
        position: 'relative',
        width: 60,
        height: 60,
        marginBottom: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#fff',
    },
    editIcon: {
        position: 'absolute',
        right: -5,
        bottom: -5,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 4,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    name: {
        ...FONTS.subtitle,
        color: '#fff',
        maxWidth: '100%',
    },
    email: {
        ...FONTS.body,
        color: '#fff',
        opacity: 0.85,
        maxWidth: '100%',
    },
    drawerList: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
    },
});


export default CustomDrawerContent;
