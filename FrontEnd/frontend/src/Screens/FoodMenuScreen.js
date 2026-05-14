import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native'; 
import { MaterialIcons } from '@expo/vector-icons';
import { MENU_DATA } from '../Data/MenuData'; 
import { OrderContext } from '../Context/OrderContext'; 

export default function FoodMenuScreen({ route, navigation }) {
  const { categoryName } = route?.params || { categoryName: 'Pollos Asados' };
  const currentMenu = MENU_DATA[categoryName] || MENU_DATA['default'] || [];
  
  const [quantities, setQuantities] = useState({});
  const { addItemsToOrder } = useContext(OrderContext); 

  const [modalVisible, setModalVisible] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [personasInfo, setPersonasInfo] = useState({}); 

  const updateQuantity = (id, increment) => {
    if (!id) return; 
    setQuantities(prev => {
      const currentQty = prev[id] || 0;
      const newQty = Math.max(0, currentQty + increment);
      return { ...prev, [id]: newQty };
    });
  };

  const handlePlus = (item) => {
    if (!item) return; 

    if (categoryName === 'Pollos Asados' || categoryName === 'Carne Asada') {
      let max = 1;
      const itemName = item.name || '';

      if (itemName.includes('1 y 1/2')) max = 6;
      else if (itemName.includes('1 Pollo') || itemName.includes('1 kg')) max = 4;
      else if (itemName.includes('1/2 Pollo') || itemName.includes('1/2 kg')) max = 2;
      else if (itemName.includes('Orden de Carne')) max = 2;

      const currentQty = quantities[item.id] || 0;
      const nextQty = currentQty + 1;
      const totalMax = max * nextQty;

      setItemSeleccionado({ ...item, maxPersonas: totalMax });
      setCantidadPersonas(totalMax); 
      setModalVisible(true);
    } else {
      updateQuantity(item.id, 1);
    }
  };

  const confirmarModal = () => {
    
    if (!itemSeleccionado || !itemSeleccionado.id) return; 

    updateQuantity(itemSeleccionado.id, 1); 
    setPersonasInfo(prev => ({ ...prev, [itemSeleccionado.id]: cantidadPersonas })); 
    setModalVisible(false);
  };

  const handleConfirm = () => {
    const itemsToAdd = [];
    currentMenu.forEach(item => {
      if (!item || !item.id) return; 

      const qty = quantities[item.id] || 0;
      if (qty > 0) {
        itemsToAdd.push({ 
          ...item, 
          quantity: qty,
          personas: personasInfo[item.id] || null 
        });
      }
    });

    if (itemsToAdd.length === 0) {
      Alert.alert("Nada seleccionado", "Selecciona al menos un producto.");
      return;
    }

    if (addItemsToOrder) {
      addItemsToOrder(itemsToAdd);
      Alert.alert('Agregado', 'Productos agregados al carrito.');
      navigation.goBack(); 
    }
  };

  const renderItem = ({ item }) => {
    if (!item) return null; 

    return (
      <View style={styles.card}>
        <View style={styles.infoContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.desc ? <Text style={styles.itemDesc}>{item.desc}</Text> : null}
          
          {personasInfo[item.id] && quantities[item.id] > 0 ? (
            <Text style={styles.personasTag}>Dividir en {personasInfo[item.id]} platos</Text>
          ) : null}

          <Text style={styles.itemPrice}>${item.price}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.btnMinus}>
            <MaterialIcons name="remove" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantities[item.id] || 0}</Text>
          
          <TouchableOpacity onPress={() => handlePlus(item)} style={styles.btnPlus}>
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{categoryName}</Text>
      <FlatList
        data={currentMenu}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}> Agregar a la Orden</Text>
        </TouchableOpacity>
      </View>

      {modalVisible && itemSeleccionado && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Para cuántas personas?</Text>
            <Text style={styles.modalSubtitle}>{itemSeleccionado.name}</Text>

            <View style={styles.stepperContainer}>
              <TouchableOpacity 
                style={styles.stepperBtn}
                onPress={() => setCantidadPersonas(prev => Math.max(1, prev - 1))}
              >
                <Text style={styles.stepperText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.stepperValue}>{cantidadPersonas}</Text>

              <TouchableOpacity 
                style={styles.stepperBtn}
                onPress={() => setCantidadPersonas(prev => Math.min(itemSeleccionado.maxPersonas, prev + 1))}
              >
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.limiteText}>Máximo: {itemSeleccionado.maxPersonas} platos</Text>

            <View style={styles.modalBotones}>
              <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.textoBlanco}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.btnConfirmar} onPress={confirmarModal}>
                <Text style={styles.textoBlanco}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

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
  personasTag: { fontSize: 13, color: '#FF6347', fontWeight: 'bold', marginBottom: 5 }, 
  controls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 25, padding: 5 },
  btnMinus: { backgroundColor: '#FF5252', borderRadius: 20, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' },
  btnPlus: { backgroundColor: '#4CAF50', borderRadius: 20, width: 35, height: 35, justifyContent: 'center', alignItems: 'center' },
  quantityText: { fontSize: 20, fontWeight: 'bold', marginHorizontal: 15, minWidth: 20, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  confirmButton: { backgroundColor: '#333', padding: 15, borderRadius: 50, alignItems: 'center', elevation: 5 },
  confirmText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { 
    position: 'absolute', 
    top: 0, bottom: 0, left: 0, right: 0, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 999, 
    elevation: 10 
  },
  modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 11 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, color: '#333', textAlign: 'center' },
  modalSubtitle: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  stepperBtn: { backgroundColor: '#FF6347', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  stepperText: { color: 'white', fontSize: 30, fontWeight: 'bold', lineHeight: 35 },
  stepperValue: { fontSize: 35, fontWeight: 'bold', marginHorizontal: 30, color: '#333' },
  limiteText: { color: '#888', marginBottom: 25, fontStyle: 'italic' },
  modalBotones: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  btnCancelar: { flex: 1, backgroundColor: '#999', padding: 15, borderRadius: 10, marginRight: 10, alignItems: 'center' },
  btnConfirmar: { flex: 1, backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, marginLeft: 10, alignItems: 'center' },
  textoBlanco: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});