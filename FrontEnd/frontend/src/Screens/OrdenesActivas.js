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
        .eq('status', 'en_cocina') 
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders = data.map(order => ({
        id: order.order_id,
        status: 'En Cocina', 
        timestamp: new Date(order.created_at).toLocaleTimeString(),
        info: {
          tipo: order.order_type,
          mesa: order.mesa,
          nombre: order.nombre_cliente, 
          telefono: order.telefono,
          direccion: order.direccion,
          metodo_takeout: order.metodo_takeout,
          detalles_vehiculo: order.detalles_vehiculo
        },
        items: order.order_items.map(item => ({
          id: item.producto_id, 
          name: item.nom_platillo,
          price: item.price, 
          quantity: item.quantity,
          comentario: item.notes,
          personas: item.num_personas || item.personas,
          plato: item.num_plato || 0 
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
            console.log("Intentando actualizar la orden con ID:", orderId);
            
            const { data, error } = await supabase
              .from('orders')
              .update({ status: 'entregada' }) 
              .eq('order_id', orderId)
              .select(); 
            
            if (error) {
              Alert.alert("Error de Supabase", error.message);
            } else if (!data || data.length === 0) {
              Alert.alert("Aviso", "Supabase no marcó error, pero tampoco actualizó nada.");
            } else {
              fetchOrders(); 
            }
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

    const agruparPorPlatos = (productos) => {
      const grupos = productos.reduce((acc, prod) => {
        const platoNum = prod.plato || 0;
        if (!acc[platoNum]) acc[platoNum] = [];
        acc[platoNum].push(prod);
        return acc;
      }, {});

      return Object.keys(grupos)
        .sort((a, b) => Number(a) - Number(b))
        .map(num => ({
          platoNum: num,
          data: grupos[num]
        }));
    };

    const gruposPlatos = agruparPorPlatos(item.items);

    const obtenerTitulo = (info) => {
      if (info.tipo === 'comer_aqui') return `MESA: ${info.mesa}`;
      if (info.tipo === 'domicilio') return `DOMICILIO: ${info.nombre || 'Sin nombre'}`;
      
      if (info.tipo === 'para_llevar') {
        if (info.metodo_takeout === 'vehiculo') {
          return `VEHÍCULO: ${info.detalles_vehiculo} ${info.nombre ? `(${info.nombre})` : ''}`;
        }
        return `A PIE: ${info.nombre || 'Sin nombre'}`;
      }
      return 'Orden Especial';
    };

    return (
      <View style={styles.ticketCard}>
        <View style={styles.ticketHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.ticketTitle}>{obtenerTitulo(item.info)}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            
            {item.info.tipo === 'domicilio' && item.info.direccion ? (
               <Text style={styles.deliveryText}>Dir: {item.info.direccion} | Tel: {item.info.telefono}</Text>
            ) : null}
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
          {gruposPlatos.map((grupo, gIndex) => (
            <View key={gIndex} style={styles.grupoContainer}>
              
              <View style={styles.platoHeaderBox}>
                <Text style={styles.platoHeaderText}>
                  {grupo.platoNum === '0' ? 'Al Centro de la Mesa' : `Plato ${grupo.platoNum}`}
                </Text>
              </View>

              {grupo.data.map((prod, index) => (
                <View key={index} style={styles.productoRow}>
                  <Text style={styles.itemText}>
                    • {prod.quantity}x {prod.name}
                    
                    {prod.personas ? (
                      <Text style={styles.personasDestacado}> [Para {prod.personas} platos]</Text>
                    ) : null}
                  </Text>

                  {prod.comentario ? (
                    <Text style={styles.extraResaltado}>   ↳ EXTRA / NOTA: {prod.comentario}</Text>
                  ) : null}
                </View>
              ))}
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
          keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
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
  deliveryText: { color: '#bbb', fontSize: 12, fontStyle: 'italic', marginTop: 4 }, // Estilo para info de domicilio
  statusContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6347', paddingVertical: 5, paddingHorizontal: 15 },
  statusText: { color: 'white', fontWeight: 'bold', marginLeft: 5, fontSize: 12 },
  itemsList: { padding: 15 },
  
  grupoContainer: { marginBottom: 15 },
  platoHeaderBox: { backgroundColor: '#EAEAEA', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 8 },
  platoHeaderText: { fontSize: 14, fontWeight: 'bold', color: '#444', textTransform: 'uppercase' },
  productoRow: { marginBottom: 8, paddingLeft: 5 },

  itemText: { fontSize: 17, color: '#333', fontWeight: '500' },
  personasDestacado: { color: '#FF6347', fontWeight: 'bold', fontSize: 16 },
  
  extraResaltado: { fontSize: 15, color: '#D35400', fontWeight: 'bold', fontStyle: 'italic', marginTop: 2 },
  
  ticketFooter: { padding: 15, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'flex-end' },
  totalText: { fontWeight: 'bold', color: '#666' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, color: '#999', marginTop: 20, textAlign: 'center' },
});