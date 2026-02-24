import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Importamos íconos

export default function NuevaOrden({ navigation }) {
  
  // Función para manejar la navegación según la opción
  const handleSelection = (tipo) => {

    if (tipo === 'ComerAquí') {
    navigation.navigate('ComerAquí'); 
  } else {
    // Aquí luego haremos la lógica para "para llevar" que en vez de pedir mesa va a pedir nombre del cliente y su numero telefonico
    console.log('Para Llevar seleccionado');
  }


  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>¿De qué tipo es la orden?</Text>

      {/* BOTÓN 1: COMER AQUÍ */}
      <TouchableOpacity 
        style={[styles.bigButton, styles.buttonDineIn]} 
        onPress={() => handleSelection('ComerAquí')}
      >
        <MaterialIcons name="restaurant" size={80} color="white" />
        <Text style={styles.buttonText}>Comer Aquí</Text>
      </TouchableOpacity>

      {/* BOTÓN 2: PARA LLEVAR */}
      <TouchableOpacity 
        style={[styles.bigButton, styles.buttonTakeOut]} 
        onPress={() => handleSelection('ParaLlevar')}
      >
        <MaterialIcons name="shopping-bag" size={80} color="white" />
        <Text style={styles.buttonText}>Para Llevar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center', // Centra todo verticalmente
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  bigButton: {
    flex: 1, // Hace que los botones se estiren para ocupar espacio
    marginVertical: 10, // Espacio entre botones
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS quien sabe si se vean o no
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // Estilo específico para Comer Aquí 
  buttonDineIn: {
    backgroundColor: '#FF6347', 
    maxHeight: 250, // Limitamos la altura 
  },
  // Estilo específico para Llevar 
  buttonTakeOut: {
    backgroundColor: '#4682B4', 
    maxHeight: 250,
  },
  buttonText: {
    color: 'white',
    fontSize: 28, 
    fontWeight: 'bold',
    marginTop: 10,
  },
});