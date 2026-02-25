import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// NOTA: Los 'title' deben ser IDÉNTICOS a las llaves de tu MenuData.js
const categories = [
  { id: '1', title: 'Pollos Asados', icon: 'local-fire-department', color: '#FF6347' },
  { id: '2', title: 'Carne Asada', icon: 'restaurant', color: '#ff0000' }, 
  { id: '3', title: 'Hamburguesas', icon: 'lunch-dining', color: '#8B4513' },
  { id: '4', title: 'Tacos', icon: 'layers', color: '#FFA500' },
  { id: '5', title: 'Burritos', icon: 'breakfast-dining', color: '#DAA520' },
  { id: '6', title: 'Empalmes', icon: 'fiber-smart-record', color: '#FF69B4' },
  { id: '7', title: 'Gorditas', icon: 'donut-small', color: '#f453e9' },
  { id: '8', title: 'Papa Asada y Tostadas', icon: 'fastfood', color: '#0059ff' }, // CORREGIDO
  { id: '9', title: 'Platillos', icon: 'restaurant-menu', color: '#3c319e' },
  { id: '10', title: 'Almuerzos', icon: 'egg-alt', color: '#882200' },
  { id: '11', title: 'Bebidas', icon: 'local-bar', color: '#4682B4' },
  { id: '12', title: 'Botanas y Extras', icon: 'tapas', color: '#2E8B57' },
];

export default function MenuCategoriesScreen({ navigation }) { // Cambié el nombre de la función
  const [mesa, setMesa] = useState('');

  // Función corregida para navegar
  const handleCategoryPress = (categoryName) => {
    // Navegamos a 'FoodMenu' y le pasamos qué categoría se eligió
    navigation.navigate('FoodMenu', { categoryName: categoryName });
  };

  const handleViewOrder = () => {
    if (mesa.trim() === '') {
      Alert.alert('Falta la Mesa', 'Por favor escribe el número de mesa antes de continuar.');
      return;
    }
    // Aquí mandaremos a la pantalla de resumen (pendiente)
    console.log('Viendo orden de la mesa: ', mesa);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: item.color }]} 
      onPress={() => handleCategoryPress(item.title)}
    >
      {/* Si no tienes icono, usa uno genérico para que no truene */}
      <MaterialIcons name={item.icon || 'restaurant'} size={40} color="white" />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* INPUT DE MESA */}
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Número de Mesa:</Text>
        <TextInput
          style={styles.input}
          placeholder="#"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={mesa}
          onChangeText={setMesa}
          maxLength={2} 
        />
      </View>

      <Text style={styles.subHeader}>Selecciona una categoría:</Text>

      {/* MENU DE CATEGORÍAS */}
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.viewOrderButton} onPress={handleViewOrder}>
          <Text style={styles.viewOrderText}>🛒 Ver Orden / Terminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2', padding: 15 },

  headerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  
  label: { fontSize: 20, fontWeight: 'bold', marginRight: 10, color: '#333' },
  
  input: { flex: 1, fontSize: 24, fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: '#FF6347', textAlign: 'center', color: '#333' },
  
  subHeader: { fontSize: 18, color: '#666', marginBottom: 10, marginLeft: 5 },
  
  row: { justifyContent: 'space-between' },
  
  card: { width: '48%', aspectRatio: 1.2, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 4 },
  
  cardText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginTop: 10, textAlign: 'center' }, 
  
  footer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  
  viewOrderButton: { backgroundColor: '#333', padding: 18, borderRadius: 50, alignItems: 'center', elevation: 5 },
  
  viewOrderText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
});