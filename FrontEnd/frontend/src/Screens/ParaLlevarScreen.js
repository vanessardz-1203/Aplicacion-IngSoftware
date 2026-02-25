import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { OrderContext } from '../Context/OrderContext';


const categories = [
  { id: '1', title: 'Pollos Asados', icon: 'local-fire-department', color: '#FF6347' },
  { id: '2', title: 'Carne Asada', icon: 'restaurant', color: '#ff0000' }, 
  { id: '3', title: 'Hamburguesas', icon: 'lunch-dining', color: '#8B4513' },
  { id: '4', title: 'Tacos', icon: 'layers', color: '#FFA500' },
  { id: '5', title: 'Burritos', icon: 'breakfast-dining', color: '#DAA520' },
  { id: '6', title: 'Empalmes', icon: 'fiber-smart-record', color: '#FF69B4' },
  { id: '7', title: 'Gorditas', icon: 'donut-small', color: '#f453e9' },
  { id: '8', title: 'Papa Asada y Tostadas', icon: 'fastfood', color: '#0059ff' },
  { id: '9', title: 'Platillos', icon: 'restaurant-menu', color: '#3c319e' },
  { id: '10', title: 'Almuerzos', icon: 'egg-alt', color: '#882200' },
  { id: '11', title: 'Bebidas', icon: 'local-bar', color: '#4682B4' },
  { id: '12', title: 'Botanas y Extras', icon: 'tapas', color: '#2E8B57' },
];

export default function ParaLlevarScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  const { setOrderInfo } = useContext(OrderContext);

  const handleCategoryPress = (categoryName) => {
    // Pasamos el nombre y telefono también por si los necesitamos guardar después
    navigation.navigate('FoodMenu', { 
      categoryName: categoryName,
      cliente: { nombre, telefono } 
    });
  };

  const handleViewOrder = () => {
    // Validaciones
    if (nombre.trim() === "" || telefono.trim() === "") {
      Alert.alert("Faltan datos", "Por favor completa el nombre y el teléfono del cliente.");
      return;
    }
    if (telefono.length !== 10) { 
      Alert.alert("Teléfono Inválido", "El número debe tener 10 dígitos exactos.");
      return;
    }

    setOrderInfo({ 
        tipo: 'ParaLlevar', // Esto le dice al resumen que muestre "Cliente" en vez de "Mesa"
        nombre: nombre, 
        telefono: telefono 
    });

    navigation.navigate("OrderSummary");


  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: item.color }]} 
      onPress={() => handleCategoryPress(item.title)}
    >
      <MaterialIcons name={item.icon || 'restaurant'} size={40} color="white" />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      {/* FORMULARIO DE CLIENTE */}
      <View style={styles.headerContainer}>
        
        {/* Campo Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Cliente:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Juan Pérez"
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
            maxLength={30}
          />
        </View>

        <View style={styles.divider} />

        {/* Campo Teléfono */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono (10 dígitos):</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 811..."
            placeholderTextColor="#999"
            value={telefono}
            onChangeText={(text) => {
               // Solo permite escribir números
               const soloNumeros = text.replace(/[^0-9]/g, "");
               setTelefono(soloNumeros);
            }}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
      </View>

      <Text style={styles.subHeader}>Selecciona una categoría:</Text>

      {/* MENÚ DE CATEGORÍAS */}
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* BOTÓN INFERIOR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.viewOrderButton} onPress={handleViewOrder}>
          <Text style={styles.viewOrderText}>🛒 Ver Orden / Terminar</Text>
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
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  input: {
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
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
    width: '48%', 
    aspectRatio: 1.2,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },
  cardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
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