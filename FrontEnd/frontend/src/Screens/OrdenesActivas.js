import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { OrderContext } from '../Context/OrderContext';
import { supabase } from "../../supabase_db/supabaseClient";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function OrdenesActivas({ navigation }) {
  const { userData, loadOrderForEditing } = useContext(OrderContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const miRol = userData?.rol?.toLowerCase() || 'mesero';

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, order_items (*)`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders = data.map(order => ({
        id: order.order_id,
        status: 'En Cocina', 
        timestamp: new Date(order.created_at).toLocaleTimeString(),
        info: {
          tipo: order.order_type === 'comer_aqui' ? 'ComerAquí' : 'ParaLlevar',
          mesa: order.mesa,
          nombre: order.name_client
        },
        items: order.order_items.map(item => ({
          name: item.nom_platillo,
          quantity: item.quantity,
          comentario: item.notes,
          
          personas: item.num_personas || item.personas 
        }))
      }));

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setOrders(formattedOrders);
    } catch (error) {
      console.log("Error de sincronización:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('cambios-en-pollos')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDeleteOrder = async (orderId) => {
    Alert.alert(
      "¿Finalizar Orden?",
      "¿Estás seguro de que esta orden ya está lista?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, finalizar", 
          onPress: async () => {
            const { error } = await supabase
              .from('orders')
              .delete() 
              .eq('order_id', orderId);
            
            if (error) Alert.alert("Error", "No se pudo eliminar de la nube.");
          }, 
          style: "destructive" 
        }
      ]
    );
  };

  const handleEdit = (order) => {
    loadOrderForEditing(order);
    navigation.navigate('OrderSummary');
  };

  const renderOrderTicket = ({ item }) => {
    const totalItems = item.items.reduce((sum, prod) => sum + prod.quantity, 0);

    return (
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <View>
            <Text style={styles.ticketTitle}>
              {item.info.tipo === 'ComerAquí' ? `Mesa ${item.info.mesa}` : `${item.info.nombre}`}
            </Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {miRol === 'cajero' && (
              <TouchableOpacity onPress={() => handleEdit(item)} style={{ marginRight: 15 }}>
                <MaterialIcons name="edit" size={32} color="#4A90E2" />
              </TouchableOpacity>
            )}

            {(miRol === 'cajero' || miRol === 'cocinero') && (
              <TouchableOpacity onPress={() => handleDeleteOrder(item.id)}>
                 <MaterialIcons name="check-circle" size={40} color="#4CAF50" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.statusContainer}>
            <MaterialIcons name="restaurant" size={16} color="white" />
            <Text style={styles.statusText}>{item.status}</Text>
        </View>

        <View style={styles.itemsList}>
          {item.items.map((prod, index) => (
            <View key={index} style={{ marginBottom: 8 }}>
              <Text style={styles.itemText}>
                • {prod.quantity}x {prod.name}
                
                {prod.personas ? (
                  <Text style={styles.personasDestacado}> [Para {prod.personas} platos]</Text>
                ) : null}
              </Text>

              {/* Notas especiales del cliente */}
              {prod.comentario ? (
                <Text style={styles.notaGris}>   ↳ Nota: {prod.comentario}</Text>
              ) : null}
            </View>
          ))}
        </View>
          
        <View style={styles.ticketFooter}>
            <Text style={styles.totalText}>Total Artículos: {totalItems}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}> 
      {loading ? (
        <ActivityIndicator size="large" color="#FF6347" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderTicket}
          keyExtractor={item => item.id.toString()}
          onRefresh={fetchOrders}
          refreshing={loading}
          contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="check-circle-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>No hay órdenes pendientes.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  ticketCard: { backgroundColor: 'white', borderRadius: 12, marginBottom: 15, overflow: 'hidden', elevation: 3 },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#333' },
  ticketTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  timestamp: { color: '#ccc', fontSize: 14, marginTop: 2 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6347', paddingVertical: 5, paddingHorizontal: 15 },
  statusText: { color: 'white', fontWeight: 'bold', marginLeft: 5, fontSize: 12 },
  itemsList: { padding: 15 },
  itemText: { fontSize: 17, color: '#333', fontWeight: '500' },
  
  personasDestacado: { color: '#FF6347', fontWeight: 'bold', fontSize: 16 },
  
  notaGris: { fontSize: 14, color: '#777', fontStyle: 'italic' },
  ticketFooter: { padding: 15, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'flex-end' },
  totalText: { fontWeight: 'bold', color: '#666' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, color: '#999', marginTop: 20, textAlign: 'center' },
});