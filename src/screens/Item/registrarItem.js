import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from 'react-native';

const RegistrarItem = () => {
  const navigation = useNavigation();

  // Función para manejar el clic en el botón de agregar
  const handleAgregar = () => {
      const confirmarYProcesar = () => {
        Alert.alert(
          'Éxito',
          'Su entrada fue realizada correctamente',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      };
    
      if (Platform.OS === 'web') {
        const confirmado = window.confirm('¿Estás seguro que deseas agregar este item?');
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#003D7C" />
          </TouchableOpacity>
          <Image source={require("../../../assets/img/logo.png")} style={styles.logo} />
          <Text style={styles.title}>AGREGAR ITEM</Text>
          <View style={styles.formContainer}>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <TextInput style={styles.input} placeholder="Tipo de repuesto" />
              </View>
              <View style={styles.inputGroup}>
                <TextInput style={styles.input} placeholder="Repuesto" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <TextInput style={styles.input} placeholder="Característica 1" />
              </View>
              <View style={styles.inputGroup}>
                <TextInput style={styles.input} placeholder="Característica 2" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <TextInput style={styles.input} placeholder="Marca" />
              </View>
              <View style={styles.inputGroup}>
                <TextInput style={styles.input} placeholder="Cantidad inicial" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <TextInput style={styles.input} placeholder="Stock mínimo" />
              </View>
              <View style={styles.inputGroup}>
                <TextInput style={styles.input} placeholder="Ubicación" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <TextInput style={styles.input} placeholder="Unidad de medida" />
              </View>
              <View style={styles.textAreaContainer}>
                <TextInput style={styles.textArea} placeholder="Observaciones" multiline numberOfLines={4} />
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleAgregar}>
              <Text style={styles.buttonText}>AGREGAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003366",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginTop: 40,
    backgroundColor: "#ECECEC",
    width: "90%",
    maxWidth: 600,
    padding: 20,
    borderRadius: 10,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  logo: {
    position: "absolute",
    top: -5,
    right: 10,
    width: 65,
    height: 80,
    resizeMode: "contain",
  },
  title: {
    color: "#616060",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputGroup: {
    width: "48%",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    placeholderTextColor: "#858484",
  },
  textAreaContainer: {
    width: "48%",
  },
  textArea: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    height: 80,
    placeholderTextColor: "#858484",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
  },
});

export default RegistrarItem;



