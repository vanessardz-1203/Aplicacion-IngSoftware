import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

// datos falsos solo para demostrar
const dummyOrders = [
  { id: '1', mesa: 'Mesa 4', estado: 'Cocinando', total: '$450', items: '1 Pollo, 2 Coca-Colas' },
  { id: '2', mesa: 'Mesa 10', estado: 'Listo', total: '$120', items: '1/2 Pollo' },
  { id: '3', mesa: 'Barra 2', estado: 'Pendiente', total: '$850', items: '2 Pollos, 1 Papa Asada, 4 Cervezas' },
  { id: '4', mesa: 'Mesa 1', estado: 'Entregado', total: '$200', items: '1 Burger, 1 Agua' },
];

export default function OrdenesActivas() {

  // Función para decidir el color según el estado
  const getStatusColor = (status) => {
    switch(status) {
      case 'Listo': return '#4CAF50'; 
      case 'Cocinando': return '#FF9800';
      case 'Pendiente': return '#F44336'; 
      default: return '#9E9E9E'; 
    }
  };

  // estilo de cada tarjeta
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.tableText}>{item.mesa}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}>
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
      </View>
      
      <Text style={styles.itemsText}>{item.items}</Text>
      
      <View style={styles.divider} />
      
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: {item.total}</Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Ver Detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Órdenes en Curso</Text>
      
      <FlatList
        data={dummyOrders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({ // Estilos generales de la pantalla
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  // Estilos de la Tarjetaw
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3, // Sombra
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tableText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemsText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});