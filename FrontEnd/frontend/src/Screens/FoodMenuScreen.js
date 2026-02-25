import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


import { MENU_DATA } from '../Data/MenuData'; 

export default function FoodMenuScreen({ route, navigation }) {
  // 1. Recibimos qué categoría presionaron en la pantalla anterior
  // Si por error no llega nada, ponemos 'Pollos Asados' por defecto para que no truene
  const { categoryName } = route.params || { categoryName: 'Pollos Asados' };
  
    console.log("Categoría recibida:", categoryName);
    console.log("Datos encontrados:", MENU_DATA[categoryName]);

  // 2. Buscamos la lista exacta en tu archivo MenuData.js
  // Si la categoría no existe en el archivo, usamos 'default' (lista vacía)
  const currentMenu = MENU_DATA[categoryName] || MENU_DATA['default'];

  // Estado para llevar la cuenta de cuántos pidieron de cada cosa
  const [quantities, setQuantities] = useState({});

  // Función para sumar o restar platillos
  const updateQuantity = (id, increment) => {
    setQuantities(prev => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + increment); // Evita números negativos
      return { ...prev, [id]: newQty };
    });
  };

  const handleConfirm = () => {
    // Aquí más adelante guardaremos la orden final
    Alert.alert('Agregado', `Se han guardado los productos de ${categoryName}.`);
    navigation.goBack(); // Regresa a las categorías para seguir pidiendo
  };

  // Diseño de cada renglón de comida
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDesc}>{item.desc}</Text> 
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>

      {/* CONTROLES DE CANTIDAD (- 0 +) */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.btnMinus}>
          <MaterialIcons name="remove" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{quantities[item.id] || 0}</Text>
        
        <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.btnPlus}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoryName}</Text>
      
      {/* LISTA DE PLATILLOS */}
      <FlatList
        data={currentMenu}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay productos en esta categoría aún.</Text>}
      />

      {/* BOTÓN INFERIOR DE CONFIRMAR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>✅ Agregar a la Orden</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6347', // Naranja Tiko
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3, // Sombra
  },
  infoContainer: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDesc: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 18,
    color: '#4CAF50', // Precio en verde
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 25,
    padding: 5,
  },
  btnMinus: {
    backgroundColor: '#FF5252', // Rojo
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPlus: {
    backgroundColor: '#4CAF50', // Verde
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
    marginTop: 50,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  confirmButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    elevation: 5,
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});