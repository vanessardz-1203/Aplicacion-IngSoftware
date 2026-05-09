import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MENU_DATA } from '../Data/MenuData'; 
import { OrderContext } from '../Context/OrderContext'; 

export default function FoodMenuScreen({ route, navigation }) {
  const { categoryName } = route.params || { categoryName: 'Pollos Asados' };
  const currentMenu = MENU_DATA[categoryName] || MENU_DATA['default'];
  
  const [quantities, setQuantities] = useState({});
  const { addItemsToOrder } = useContext(OrderContext); 

  const updateQuantity = (id, increment) => {
    setQuantities(prev => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + increment);
      return { ...prev, [id]: newQty };
    });
  };

  const handleConfirm = () => {
    //  Filtramos solo los productos que tienen cantidad > 0
    const itemsToAdd = [];
    currentMenu.forEach(item => {
      const qty = quantities[item.id] || 0;
      if (qty > 0) {
        itemsToAdd.push({ ...item, quantity: qty });
      }
    });

    if (itemsToAdd.length === 0) {
      Alert.alert("Nada seleccionado", "Selecciona al menos un producto.");
      return;
    }

    //  Los guardamos en la memoria global
    addItemsToOrder(itemsToAdd);
    
    Alert.alert('Agregado', 'Productos agregados al carrito.');
    navigation.goBack(); 
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDesc}>{item.desc}</Text> 
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
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
      <FlatList
        data={currentMenu}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>✅ Agregar a la Orden</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2', padding: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FF6347', marginBottom: 20, textAlign: 'center', marginTop: 10 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3 },
  infoContainer: { flex: 1, paddingRight: 10 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  itemDesc: { fontSize: 14, color: '#888', fontStyle: 'italic', marginBottom: 5 },
  itemPrice: { fontSize: 18, color: '#4CAF50', fontWeight: 'bold' },
  controls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 25, padding: 5 },
  btnMinus: { backgroundColor: '#FF5252', borderRadius: 20, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' },
  btnPlus: { backgroundColor: '#4CAF50', borderRadius: 20, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' },
  quantityText: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 15, minWidth: 20, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  confirmButton: { backgroundColor: '#333', padding: 15, borderRadius: 50, alignItems: 'center', elevation: 5 },
  confirmText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});