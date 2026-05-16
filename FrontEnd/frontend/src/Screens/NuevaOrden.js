import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function NuevaOrden({ navigation }) {
  
  // Función para manejar la navegación según la opción
  const handleSelection = (tipo) => {
    if (tipo === 'ComerAquí') {
      navigation.navigate('MenuCategories'); 
    } else if (tipo === 'ParaLlevar') {
      navigation.navigate("ParaLlevar");
    } else if (tipo === 'Domicilio') {
      navigation.navigate("Domicilio"); 
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
        <MaterialIcons name="restaurant" size={70} color="white" />
        <Text style={styles.buttonText}>Comer Aquí</Text>
      </TouchableOpacity>

      {/* BOTÓN 2: PARA LLEVAR (Pasa a recoger) */}
      <TouchableOpacity 
        style={[styles.bigButton, styles.buttonTakeOut]} 
        onPress={() => handleSelection('ParaLlevar')}
      >
        <MaterialIcons name="directions-walk" size={70} color="white" />
        <Text style={styles.buttonText}>Pasa a Recoger</Text>
      </TouchableOpacity>

      {/* BOTÓN 3: A DOMICILIO */}
      <TouchableOpacity 
        style={[styles.bigButton, styles.buttonDelivery]} 
        onPress={() => handleSelection('Domicilio')}
      >
        <MaterialIcons name="two-wheeler" size={70} color="white" />
        <Text style={styles.buttonText}>A Domicilio</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center', 
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  bigButton: {
    flex: 1, 
    marginVertical: 10, 
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDineIn: {
    backgroundColor: '#FF6347', 
    maxHeight: 180, 
  },
  buttonTakeOut: {
    backgroundColor: '#4682B4', 
    maxHeight: 180,
  },
  buttonDelivery: {
    backgroundColor: '#4CAF50', 
    maxHeight: 180,
  },
  buttonText: {
    color: 'white',
    fontSize: 26, 
    fontWeight: 'bold',
    marginTop: 10,
  },
});