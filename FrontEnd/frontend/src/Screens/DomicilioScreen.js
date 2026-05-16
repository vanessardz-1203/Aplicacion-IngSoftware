import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Platform } from 'react-native';
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

export default function DomicilioScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  const { setOrderInfo } = useContext(OrderContext);

  const validarFormulario = () => {
    if (!nombre || nombre.trim() === "") {
      const msg = "Por favor escribe el nombre del cliente antes de continuar.";
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Faltan datos", msg);
      return false;
    }

    if (!telefono || telefono.trim() === "") {
      const msg = "Por favor completa el teléfono del cliente.";
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Faltan datos", msg);
      return false;
    }

    if (telefono.length !== 10) {
      const msg = "El número de teléfono debe tener 10 dígitos exactos.";
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Teléfono Inválido", msg);
      return false;
    }

    if (!direccion || direccion.trim() === "") {
      const msg = "Por favor ingresa la dirección de entrega.";
      Platform.OS === 'web' ? window.alert(msg) : Alert.alert("Faltan datos", msg);
      return false;
    }

    return true;
  };

  const guardarDatosEnContexto = () => {
    setOrderInfo({ 
        tipo: 'Domicilio', 
        nombre: nombre, 
        telefono: telefono,
        direccion: direccion
    });
  };

  const handleCategoryPress = (categoryName) => {
    if (!validarFormulario()) return;

    guardarDatosEnContexto();

    navigation.navigate('FoodMenu', { 
      categoryName: categoryName
    });
  };

  const handleViewOrder = () => {
    if (!validarFormulario()) return;
    
    guardarDatosEnContexto();
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
      
      {/* FORMULARIO DE CLIENTE A DOMICILIO */}
      <View style={styles.headerContainer}>
        
        {/* Campo Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del Cliente:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Juan Perez"
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
            placeholder="Ej. 826..."
            placeholderTextColor="#999"
            value={telefono}
            onChangeText={(text) => {
               const soloNumeros = text.replace(/[^0-9]/g, "");
               setTelefono(soloNumeros);
            }}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <View style={styles.divider} />

        {/* Campo Dirección */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección de Entrega:</Text>
          <TextInput
            style={styles.input}
            placeholder="Calle, Número, Colonia o Referencias"
            placeholderTextColor="#999"
            value={direccion}
            onChangeText={setDireccion}
            maxLength={100}
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