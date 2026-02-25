import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { OrderContext } from '../Context/OrderContext';

export default function OrdenesActivas() {
  // Traemos la lista de órdenes activas del "cerebro"
  const { activeOrders } = useContext(OrderContext);

  // Diseño de cada "Ticket" de orden
  const renderOrderTicket = ({ item }) => {
    // Calculamos el total de platillos en esta orden
    const totalItems = item.items.reduce((sum, prod) => sum + prod.quantity, 0);

    return (
      <View style={styles.ticketCard}>
        {/* Encabezado del Ticket: Mesa/Cliente y Hora */}
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketTitle}>
            {item.info.tipo === 'ComerAquí' ? `Mesa ${item.info.mesa}` : `${item.info.nombre}`}
          </Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
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
        contentContainerStyle={{ padding: 15 }}
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
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  ticketCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden', // Para que la barra de estado no se salga
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#333',
  },
  ticketTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  timestamp: { color: '#ccc', fontSize: 14 },
  statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FF6347', // Naranja para "En Cocina"
      paddingVertical: 5,
      paddingHorizontal: 15,
  },
  statusText: { color: 'white', fontWeight: 'bold', marginLeft: 5, fontSize: 12 },
  itemsList: { padding: 15 },
  itemText: { fontSize: 16, color: '#333', marginBottom: 5 },
  ticketFooter: {
      padding: 15,
      borderTopWidth: 1,
      borderTopColor: '#eee',
      alignItems: 'flex-end'
  },
  totalText: { fontWeight: 'bold', color: '#666'},
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, color: '#999', marginTop: 20, textAlign: 'center' },
});