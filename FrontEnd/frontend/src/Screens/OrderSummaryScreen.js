import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { OrderContext } from '../Context/OrderContext';
import ModalComentarios from '../Components/ModalComentarios'; 

export default function OrderSummaryScreen({ navigation }) {
  // funciones y estados que vamos a usar del contexto
  const { orderItems, orderInfo, decreaseItemQuantity, finalizeOrder, updateItemExtras } = useContext(OrderContext);

  
  const [modalVisible, setModalVisible] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [indexSeleccionado, setIndexSeleccionado] = useState(null);

  
  // Si el platillo tiene un priceFinal (porque le agregaron extras), usa ese. Si no, usa su precio normal.
  const total = orderItems.reduce((sum, item) => {
    const precioUnitario = item.priceFinal ? item.priceFinal : item.price;
    return sum + (precioUnitario * item.quantity);
  }, 0);

const handleSendOrder = () => {
    if (orderItems.length === 0) {
      Alert.alert("Orden Vacía", "No hay nada que enviar.");
      return;
    }

    finalizeOrder();
    
    Alert.alert(
      "¡Orden Enviada!", 
      "El pedido ha sido enviado a cocina.",
      [{ 
        text: "OK", 
        onPress: () => {
          navigation.navigate('Menu'); // Volvemos al inicio después de enviar
        }
      }]
    );
  };

  const confirmarEliminacion = (index, itemName) => {
    if (Platform.OS === 'web') {
      const confirmar = window.confirm(`¿Estás seguro que quieres eliminar '${itemName}' del pedido?`);
      if (confirmar) decreaseItemQuantity(index);
    } else {
      Alert.alert(
        "Eliminar Platillo",
        `¿Estás seguro que quieres eliminar '${itemName}' del pedido?`,
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", onPress: () => decreaseItemQuantity(index), style: "destructive" }
        ]
      );
    }
  };

  // Renderizado de cada renglón del resumen
  const renderItem = ({ item, index }) => {
    // Calculamos el precio a mostrar en el renglón
    const precioMostrar = (item.priceFinal ? item.priceFinal : item.price) * item.quantity;

    return (
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={styles.quantityBadge}>{item.quantity}x</Text>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            {/* si tiene comentario se muestra chikito*/}
            {item.comentario ? <Text style={styles.notaGrisText}>{item.comentario}</Text> : null}
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
           <Text style={styles.itemPrice}>${precioMostrar}</Text>
           
          {/* Botón para editar */}
          <TouchableOpacity 
            onPress={() => {
              setItemSeleccionado(item);
              setIndexSeleccionado(index); // Guardamos qué renglón es
              setModalVisible(true);       // Abrimos el modal
            }} 
            style={styles.actionButton}
          >
            <MaterialIcons name="edit" size={28} color="#4A90E2" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => confirmarEliminacion(index, item.name)} style={styles.actionButton}>
            <MaterialIcons name="remove-circle" size={28} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.infoText}>
          {orderInfo?.mesa ? `Mesa: ${orderInfo.mesa}` : `Para Llevar: ${orderInfo?.nombre || 'Sin nombre'}`}
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
          {/* Total actualizado */}
          <Text style={styles.totalAmount}>${total}</Text> 
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleSendOrder}>
          <Text style={styles.confirmText}> CONFIRMAR Y ENVIAR A COCINA </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addMoreButton} onPress={() => navigation.goBack()}>
          <Text style={styles.addMoreText}> ← Seguir agregando</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para comentarios y extras */}
      <ModalComentarios 
        visible={modalVisible} 
        item={itemSeleccionado}
        onClose={() => setModalVisible(false)}
        onSave={(comentario, costoExtras) => {
          
          updateItemExtras(indexSeleccionado, comentario, costoExtras); 
          setModalVisible(false); // cerramos el modal
        }}
      />

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
  itemName: { fontSize: 16, color: '#333' }, 
  notaGrisText: { fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 2 }, 
  itemPrice: { fontSize: 16, color: '#4CAF50', fontWeight: 'bold', marginRight: 15 },
  actionButton: { padding: 5, marginLeft: 10 }, 
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