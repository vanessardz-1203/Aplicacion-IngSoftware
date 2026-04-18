import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { OrderContext } from '../Context/OrderContext';
import ModalComentarios from '../Components/ModalComentarios'; 

import ModalPrecio from '../Components/ModalPrecio';
import { supabase } from "../../supabase_db/supabaseClient"

export default function OrderSummaryScreen({ navigation }) {
  // funciones y estados que vamos a usar del contexto
  const { orderItems, orderInfo, decreaseItemQuantity, finalizeOrder, updateItemExtras, updateItemPrice, editingOrderId } = useContext(OrderContext);

  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPrecioVisible, setModalPrecioVisible] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [indexSeleccionado, setIndexSeleccionado] = useState(null);

  
  // Si el platillo tiene un priceFinal (porque le agregaron extras), usa ese. Si no, usa su precio normal.
  const total = orderItems.reduce((sum, item) => {
    const precioUnitario = item.priceFinal ? item.priceFinal : item.price;
    return sum + (precioUnitario * item.quantity);
  }, 0);

const handleSendOrder = async () => {
  if (orderItems.length === 0) {
    Alert.alert("Orden Vacía", "No hay nada que enviar.");
    return;
  }

  try {
    const total = orderItems.reduce((sum, item) => {
      const precio = item.priceFinal ? item.priceFinal : item.price;
      return sum + (precio * item.quantity);
    }, 0);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_type: orderInfo.tipo === 'ComerAquí' ? 'comer_aqui' : 'para_llevar',
          mesa: orderInfo.mesa || null,
          name_client: orderInfo.nombre || null,
          telefono: orderInfo.telefono || null,
          total_price: total
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    const itemsToInsert = orderItems.map(item => {
      const precioFinal = item.priceFinal ? item.priceFinal : item.price;

      return {
        order_id: orderData.order_id,
        nom_platillo: item.name,
        price: precioFinal,
        quantity: item.quantity,
        subtotal: precioFinal * item.quantity,
        notes: item.comentario || null
      };
    });

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    finalizeOrder();

    Alert.alert(
      "¡Orden Guardada!",
      [{
        text: "OK",
        onPress: () => navigation.navigate('Menu')
      }]
    );

  } catch (error) {
    console.error("ERROR:", error);
    Alert.alert("Error", "No se pudo guardar la orden.");
  }
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


   const handleAddMore = () => {
    // asegurarse que los mande al menu de categorias independiente si es para comer aqui o para llevar
    if (orderInfo?.tipo === 'ComerAquí') {
      navigation.navigate('MenuCategories'); 
    } else {
      navigation.navigate('ParaLlevar');
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

            {/* Botón para ajustar precio manualmente */}
          <TouchableOpacity 
            onPress={() => {
              setItemSeleccionado(item);
              setIndexSeleccionado(index);
              setModalPrecioVisible(true);
            }} 
            style={styles.actionButton}
          >
            <MaterialIcons name="attach-money" size={28} color="#FBC02D" />
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
          <Text style={styles.confirmText}> 
            {editingOrderId ? "GUARDAR CAMBIOS" : "CONFIRMAR Y ENVIAR A COCINA"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addMoreButton} onPress={handleAddMore}>
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

      <ModalPrecio 
        visible={modalPrecioVisible}
        item={itemSeleccionado}
        onClose={() => setModalPrecioVisible(false)}
        onSave={(nuevoPrecio) => {
          updateItemPrice(indexSeleccionado, nuevoPrecio);
          setModalPrecioVisible(false);
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