import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { OrderContext } from '../Context/OrderContext';

export default function OrdenesActivas({ navigation }) {
  // funciones y estados que vamos a usar del contexto
  const { activeOrders, removeActiveOrder, loadOrderForEditing } = useContext(OrderContext);

  // Funcion de confirmación
  const handleDeleteOrder = (orderId) => {
    Alert.alert(
      "¿Finalizar Orden?",
      "¿Estás seguro de que esta orden ya está lista y quieres quitarla de la pantalla?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, finalizar", onPress: () => removeActiveOrder(orderId), style: "destructive" }
      ]
    );
  };


  const handleEdit = (order) => {
    loadOrderForEditing(order); // "Cargamos" la orden en el carrito
    navigation.navigate('OrderSummary'); // Saltamos al carrito
  };

  const renderOrderTicket = ({ item }) => {
    const totalItems = item.items.reduce((sum, prod) => sum + prod.quantity, 0);

    return (
      <View style={styles.ticketCard}>
        {/* Encabezado del Ticket */}
<View style={styles.ticketHeader}>
          <View>
            <Text style={styles.ticketTitle}>
              {item.info.tipo === 'ComerAquí' ? `Mesa ${item.info.mesa}` : `${item.info.nombre}`}
            </Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Botón de Editar  */}
            <TouchableOpacity onPress={() => handleEdit(item)} style={{ marginRight: 15 }}>
              <MaterialIcons name="edit" size={32} color="#4A90E2" />
            </TouchableOpacity>

            {/* Boton de finalizar la orden  */}
            <TouchableOpacity onPress={() => handleDeleteOrder(item.id)}>
               <MaterialIcons name="check-circle" size={40} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Estado de la orden */}
        <View style={styles.statusContainer}>
            <MaterialIcons name="restaurant" size={16} color="white" />
            <Text style={styles.statusText}>{item.status}</Text>
        </View>

        {/* Lista breve de platillos */}
        <View style={styles.itemsList}>
          {item.items.map((prod, index) => (
            <Text key={index} style={styles.itemText}>
              • {prod.quantity}x {prod.name}
              {/* Si el platillo trae comentarios o precio manual, lo mostramos en chiquito */}
              {prod.comentario ? <Text style={styles.notaGris}>  ({prod.comentario})</Text> : null}
            </Text>
          ))}
        </View>
         
        {/* Pie del ticket */}
        <View style={styles.ticketFooter}>
            <Text style={styles.totalText}>Total Artículos: {totalItems}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}> 
      <FlatList
        data={activeOrders}
        renderItem={renderOrderTicket}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="check-circle-outline" size={80} color="#ddd" />
            <Text style={styles.emptyText}>No hay órdenes pendientes en cocina.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#F2F2F2' 
  },

  ticketCard: { 
    backgroundColor: 'white',
    borderRadius: 12, 
    marginBottom: 15, 
    overflow: 'hidden', 
    elevation: 3 
  },

  ticketHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: '#333' 
  },

  ticketTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'white' 
  },
  timestamp: { 
    color: '#ccc', 
    fontSize: 14, 
    marginTop: 2 
  },
  statusContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FF6347', 
    paddingVertical: 5, 
    paddingHorizontal: 15 
  },
  statusText: { 
    color: 'white', 
    fontWeight: 'bold', 
    marginLeft: 5, 
    fontSize: 12 
  },
  itemsList: { 
    padding: 15 
  },
  itemText: { 
    fontSize: 16, 
    color: '#333', 
    marginBottom: 5 
  },
  notaGris: { 
    fontSize: 12, 
    color: '#888', 
    fontStyle: 'italic' 
  },
  ticketFooter: { 
    padding: 15, 
    borderTopWidth: 1, 
    borderTopColor: '#eee', 
    alignItems: 'flex-end' 
  },
  totalText: { 
    fontWeight: 'bold', 
    color: '#666'},

  emptyContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 100 
  },
  emptyText: { 
    fontSize: 18, 
    color: '#999', 
    marginTop: 20, 
    textAlign: 'center' 
  },
});