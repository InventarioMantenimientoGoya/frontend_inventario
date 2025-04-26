import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/Usuario/Login';
import MainDrawer from './MainDrawer';
import RegistrarItem from '../screens/Item/registrarItem';
import FormularioEntrada from '../screens/Entrada/EntradaItem';
import FormularioSalida from '../screens/Salida/SalidaItem';
import PrestamoHerramienta from '../screens/Herramienta/PrestamoHerramienta';
import RegistroUsuario from '../screens/Usuario/RegistroUsuario';
import VerificacionLogin from '../screens/Usuario/VerificacionLogin';
import VerificacionRegistro from '../screens/Usuario/VerificacionRegistro';
import OlvidoContrasena from '../screens/Usuario/OlvidoContrasena';
import CorreoRecuperacion from '../screens/Usuario/CorreoRecuperacion';
import EditarUsuario from '../screens/Usuario/EditarUsuario';
import AuthGuard from '../screens/Usuario/AuthGuard';
import CerrarSesionEditar from '../screens/Usuario/CerrarSesionEditar';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null); // 👈 controlamos cuál será la ruta inicial
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const ultimaRuta = await AsyncStorage.getItem('ultimaRuta');

        if (token) {
          // Si tiene token, va a la última ruta válida o al Main
          setInitialRoute('Main');
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        setInitialRoute('Login');
      }
    };

    verificarSesion();
  }, []);

  if (!initialRoute) {
    return null; // o un loader
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        routeNameRef.current = currentRouteName;
        await AsyncStorage.setItem('ultimaRuta', currentRouteName);
      }}
    >
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>

        {/* Rutas públicas */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro_Usuario" component={RegistroUsuario} />
        <Stack.Screen name="Verificacion_Login" component={VerificacionLogin} />
        <Stack.Screen name="Verificacion_Registro" component={VerificacionRegistro} />
        <Stack.Screen name="Olvido_Contrasena" component={OlvidoContrasena} />
        <Stack.Screen name="Correo_Recuperacion" component={CorreoRecuperacion} />
        <Stack.Screen name="Cerrar_Sesion_Editar" component={CerrarSesionEditar} />

        {/* Rutas protegidas */}
        <Stack.Screen name="Main">
          {() => (
            <AuthGuard>
              <MainDrawer />
            </AuthGuard>
          )}
        </Stack.Screen>
        <Stack.Screen name="Agregar_Item">
          {() => (
            <AuthGuard>
              <RegistrarItem />
            </AuthGuard>
          )}
        </Stack.Screen>
        <Stack.Screen name="Entrada_Item">
          {() => (
            <AuthGuard>
              <FormularioEntrada />
            </AuthGuard>
          )}
        </Stack.Screen>
        <Stack.Screen name="Salida_Item">
          {() => (
            <AuthGuard>
              <FormularioSalida />
            </AuthGuard>
          )}
        </Stack.Screen>
        <Stack.Screen name="Agregar_Prestamo">
          {() => (
            <AuthGuard>
              <PrestamoHerramienta />
            </AuthGuard>
          )}
        </Stack.Screen>
        <Stack.Screen name="Editar_Usuario">
          {() => (
            <AuthGuard>
              <EditarUsuario />
            </AuthGuard>
          )}
        </Stack.Screen>


      </Stack.Navigator>
    </NavigationContainer>
  );
}



