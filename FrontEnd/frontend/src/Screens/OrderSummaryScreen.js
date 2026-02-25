import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { OrderContext } from '../Context/OrderContext';

export default function OrderSummaryScreen({ navigation }) {
  // Usamos decreaseItemQuantity y finalizeOrder
  const { orderItems, orderInfo, decreaseItemQuantity, finalizeOrder } = useContext(OrderContext);

  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSendOrder = () => {
    if (orderItems.length === 0) {
      Alert.alert("Orden Vacía", "No hay nada que enviar.");
      return;
    }


    finalizeOrder();
    
    Alert.alert(
      "¡Orden Enviada!", 
      "El pedido ha sido enviado a cocina.",
      [{ text: "OK", onPress: () => {
          navigation.popToTop(); 
      }}]
    );
  };

  // Renderizado de cada renglón del resumen
  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      {/* Lado izquierdo: Cantidad y Nombre */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <Text style={styles.quantityBadge}>{item.quantity}x</Text>
        <Text style={styles.itemName}>{item.name}</Text>
      </View>

      {/* Lado derecho: Precio y Botón de restar */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
         <Text style={styles.itemPrice}>${item.price * item.quantity}</Text>
         
         
        <TouchableOpacity onPress={() => decreaseItemQuantity(index)} style={styles.decreaseButton}>
            {/* Ícono de "menos" en un círculo rojo */}
          <MaterialIcons name="remove-circle" size={28} color="#FF5252" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.infoText}>
          {orderInfo.tipo === 'ComerAquí' ? ` Mesa: ${orderInfo.mesa}` : ` Para Llevar: ${orderInfo.nombre}`}
        </Text>
      </View>

      <Text style={styles.subTitle}>Revisa el pedido antes de enviar:</Text>

      <FlatList
        data={orderItems}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={<Text style={styles.emptyText}> El carrito está vacío. </Text>}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${total}</Text>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleSendOrder}>
          <Text style={styles.confirmText}> CONFIRMAR Y ENVIAR A COCINA </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addMoreButton} onPress={() => navigation.goBack()}>
          <Text style={styles.addMoreText}> ← Seguir agregando</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2', padding: 20 },
  header: { backgroundColor: '#333', padding: 15, borderRadius: 10, marginBottom: 15 },
  infoText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  subTitle: { fontSize: 16, marginBottom: 10, color: '#666' },
  card: { backgroundColor: 'white', padding: 10, paddingHorizontal: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 2 },
  quantityBadge: { fontSize: 18, fontWeight: 'bold', color: '#FF6347', marginRight: 10 },
  itemName: { fontSize: 16, color: '#333', flex: 1 }, 
  itemPrice: { fontSize: 16, color: '#4CAF50', fontWeight: 'bold', marginRight: 15 },
  decreaseButton: { padding: 5 }, 
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5 },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
  totalLabel: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  totalAmount: { fontSize: 26, fontWeight: 'bold', color: '#FF6347' },
  confirmButton: { backgroundColor: '#FF6347', padding: 15, borderRadius: 50, alignItems: 'center', marginBottom: 10 },
  confirmText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  addMoreButton: { alignItems: 'center', padding: 10 },
  addMoreText: { color: '#666', fontSize: 16 },
});