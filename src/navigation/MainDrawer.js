import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import ItemScreen from '../screens/Item/itemScreen';
import EntradaScreen from '../screens/Entrada/EntradaScreen';
import SalidaScreen from '../screens/Salida/SalidaScreen';
import HerramientaScreen from '../screens/Herramienta/HerramientaScreen';
import InvHerramienta from '../screens/Herramienta/InvHerramienta';
import UsuariosScreen from '../screens/Usuario/UsuariosScreen';
/*import CategoriaScreen from '../screens/Categoria/CategoriaScreen';*/
import CerrarSesion from '../screens/Usuario/CerrarSesion';

import CustomDrawerContent from '../navigation/CustomDrawerContent';
import { COLORS } from '../styles/globalStyles';
import CategoriaModal from '../screens/Categoria/CategoriaScreen';
import AuthGuard from '../screens/Usuario/AuthGuard';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function ItemStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Item_Screen">
        {() => (
          <AuthGuard>
            <ItemScreen />
          </AuthGuard>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function EntradaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Entrada_Screen" >
        {() => (
          <AuthGuard>
            <EntradaScreen />
          </AuthGuard>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function SalidaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Salida_Screen" >
        {() => (
          <AuthGuard>
            <SalidaScreen />
          </AuthGuard>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function HerramientaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Herramienta_Screen" >
        {() => (
          <AuthGuard>
            <HerramientaScreen />
          </AuthGuard>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function InvHerramientaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InvHerramienta_Screen" >
        {() => (
          <AuthGuard>
            <InvHerramienta />
          </AuthGuard>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function UsuariosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Usuarios_Screen"  >
        {() => (
          <AuthGuard>
            <UsuariosScreen />
          </AuthGuard>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function CategoriaStack() {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categoria_Screen" >
        {() => (
          <AuthGuard>
            <CategoriaModal />
          </AuthGuard>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'back',
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: '#777',
      }}
    >
      <Drawer.Screen
        name="Items"
        component={ItemStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Entradas"
        component={EntradaStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-in-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Salidas"
        component={SalidaStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Herramientas"
        component={HerramientaStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="construct-outline" size={20} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Inventario De Herramientas"
        component={InvHerramientaStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="construct-outline" size={20} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Usuarios"
        component={UsuariosStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={20} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Categorias"
        component={CategoriaStack}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" size={20} color={color} />
          ),
        }}
      />


      <Drawer.Screen
        name="Cerrar Sesion"
        component={CerrarSesion}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="exit-outline" size={20} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
