import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Comidas que hay en el menu, el icon es opcional, pero si quieres puedes usar los de MaterialIcons (https://fonts.google.com/icons) o cualquier otro paquete de íconos
const categories = [
  { id: '1', title: 'Pollos Asados', icon: 'local-fire-department', color: '#FF6347' }, // Rojo Tiko
  { id: '2', title: 'Tacos', icon: 'layers', color: '#FFA500' }, // Naranja
  { id: '3', title: 'Hamburguesas', icon: 'lunch-dining', color: '#8B4513' }, // Café
  { id: '4', title: 'Burritos', icon: 'breakfast-dining', color: '#DAA520' }, // Dorado
  { id: '5', title: 'Bebidas', icon: 'local-bar', color: '#4682B4' }, // Azul
  { id: '6', title: 'Botanas', icon: 'fastfood', color: '#2E8B57' }, // Verde
  { id: '7', title: 'Enpalmes', icon: '', color: '#FF69B4' }, // Rosa 
  { id: '8', title: 'Tostadas', icon: '', color: '#0059ff' }, 
  { id: '9', title: 'Gorditas', icon: '', color: '#f453e9' }, 
  { id: '10', title: 'Almuerzos', icon: '', color: '#882200' }, 
  { id: '11', title: 'Platillos', icon: '', color: '#3c319e' }, 
  { id: '12', title: 'Carne Asada', icon: '', color: '#ff0000' }, 
];

export default function ComerAquí({ navigation }) {
  const [mesa, setMesa] = useState('');

  // Función cuando presionan una categoría
  const handleCategoryPress = (categoryName) => {
    console.log('Ir a la pantalla de: ', categoryName);
    // Aquí más adelante pondremos: navigation.navigate('DetalleComida', { categoria: categoryName }); y nuevas screens para cada comida
  };

  // Función para termir la orden y asegurarse de que se puso el numero de la mesa
  const handleViewOrder = () => {
    if (mesa.trim() === '') {
      Alert.alert('Falta la Mesa', 'Por favor escribe el número de mesa antes de continuar.');
      return;
    }
    console.log('Viendo orden de la mesa: ', mesa);
    // navigation.navigate('ResumenOrden'); // Próximamente
  };

  // Diseño de cada botón cuadrado del menú
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: item.color }]} 
      onPress={() => handleCategoryPress(item.title)}
    >
      <MaterialIcons name={item.icon} size={40} color="white" />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      {/* 1. INPUT DE MESA */}
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Número de Mesa:</Text>
        <TextInput
          style={styles.input}
          placeholder="#"
          placeholderTextColor="#999"
          keyboardType="numeric" // Solo abre teclado de números en telefonos y tablets
          value={mesa}
          onChangeText={setMesa}
          maxLength={2}
        />
      </View>

      <Text style={styles.subHeader}>Selecciona una categoría:</Text>

      {/* 2. nenu de comidas */}
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2} // 2 columnas
        columnWrapperStyle={styles.row} // Espacio entre columnas
        contentContainerStyle={{ paddingBottom: 100 }} // Espacio para que el botón de abajo no tape nada
      />

      {/* 3. boton para ir a ver orden y terminarla fijo hasta abajo */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.viewOrderButton} onPress={handleViewOrder}>
          <Text style={styles.viewOrderText}> Ver Orden / Terminar</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#FF6347',
    textAlign: 'center',
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    marginLeft: 5,
  },
  
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '45%', // Casi la mitad para que quepan 2
    aspectRatio: 1.2, // Los hace cuadraditos/rectangulares
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },
  cardText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  // Estilos del Botón Footer, el de terminar orden 
  footer: {
    position: 'absolute', // se queda fijo 
    bottom: 20,
    left: 20,
    right: 20,
  },
  viewOrderButton: {
    backgroundColor: '#333',
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
    elevation: 5,
  },
  viewOrderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});