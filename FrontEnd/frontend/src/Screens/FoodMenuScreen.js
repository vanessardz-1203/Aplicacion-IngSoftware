import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native'; 
import { MaterialIcons } from '@expo/vector-icons';
import { MENU_DATA } from '../Data/MenuData'; 
import { OrderContext } from '../Context/OrderContext'; 

export default function FoodMenuScreen({ route, navigation }) {
  const { categoryName } = route?.params || { categoryName: 'Pollos Asados' };
  
  const [isHarina, setIsHarina] = useState(false);

  let currentMenu = MENU_DATA[categoryName] || MENU_DATA['default'] || [];
  if (categoryName === 'Tacos') {
    currentMenu = isHarina ? (MENU_DATA['Tacos Harina'] || []) : (MENU_DATA['Tacos Maiz'] || []);
  }

  const allPossibleItems = categoryName === 'Tacos' 
    ? [...(MENU_DATA['Tacos Maiz'] || []), ...(MENU_DATA['Tacos Harina'] || [])]
    : currentMenu;
  
  const [quantities, setQuantities] = useState({});
  const { addItemsToOrder, platoActivo, setPlatoActivo } = useContext(OrderContext); 

  const [modalVisible, setModalVisible] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [personasInfo, setPersonasInfo] = useState({}); 

  const handleCambiarPlato = (incremento) => {
    const nuevoPlato = Math.max(0, platoActivo + incremento);
    
    if (nuevoPlato !== platoActivo) {
      const tieneCosasSinGuardar = Object.values(quantities).some(q => q > 0);
      
      if (tieneCosasSinGuardar) {
        Alert.alert(
          "Productos sin agregar",
          "Primero presiona 'Agregar a la Orden' para guardar lo de esta persona antes de pasar al siguiente plato."
        );
        return;
      }
      setPlatoActivo(nuevoPlato);
    }
  };

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
    
    allPossibleItems.forEach(item => {
      if (!item || !item.id) return; 

      const qty = quantities[item.id] || 0;
      if (qty > 0) {
        let finalName = item.name;
        
        if (categoryName === 'Tacos') {
            finalName = item.id.includes('-h') ? `${item.name} (Harina)` : `${item.name} (Maíz)`;
        }

        itemsToAdd.push({ 
          ...item, 
          name: finalName,
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
      setQuantities({});
      setPersonasInfo({});
    }
  };

  const renderItem = ({ item }) => {
    if (!item) return null; 

    const currentQty = quantities[item.id] || 0;

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
          
          <Text style={styles.quantityText}>{currentQty}</Text>
          
          <TouchableOpacity onPress={() => handlePlus(item)} style={styles.btnPlus}>
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.topHeader}>
        <Text style={styles.title}>{categoryName}</Text>
        
        {categoryName === 'Tacos' && (
          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, !isHarina && styles.activeLabel]}>Maíz</Text>
            <Switch
              value={isHarina}
              onValueChange={setIsHarina}
              trackColor={{ false: '#D3D3D3', true: '#D3D3D3' }}
              thumbColor={isHarina ? '#FF6347' : '#FBC02D'}
            />
            <Text style={[styles.switchLabel, isHarina && styles.activeLabel]}>Harina</Text>
          </View>
        )}
        
        <View style={styles.platoController}>
          <Text style={styles.platoLabel}>Agregando a:</Text>
          <View style={styles.platoSelector}>
            <TouchableOpacity 
              style={styles.platoBtn} 
              onPress={() => handleCambiarPlato(-1)}
            >
              <MaterialIcons name="remove" size={20} color="#666" />
            </TouchableOpacity>

            <Text style={styles.platoActivoText}>
              {platoActivo === 0 ? "Centro de mesa" : `Plato ${platoActivo}`}
            </Text>

            <TouchableOpacity 
              style={styles.platoBtn} 
              onPress={() => handleCambiarPlato(1)}
            >
              <MaterialIcons name="add" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
  container: { flex: 1, backgroundColor: '#F2F2F2' },
  
  topHeader: { backgroundColor: 'white', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 15, elevation: 2 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FF6347', textAlign: 'center', marginBottom: 10 },
  
  switchContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15, backgroundColor: '#f9f9f9', padding: 8, borderRadius: 20, alignSelf: 'center' },
  switchLabel: { fontSize: 16, color: '#999', marginHorizontal: 10, fontWeight: '500' },
  activeLabel: { color: '#333', fontWeight: 'bold' },

  platoController: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', padding: 8, borderRadius: 10 },
  platoLabel: { fontSize: 14, color: '#666', marginRight: 10, fontWeight: '500' },
  platoSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 20, borderWidth: 1, borderColor: '#eee' },
  platoBtn: { padding: 8, px: 12 },
  platoActivoText: { fontSize: 16, fontWeight: 'bold', color: '#333', minWidth: 120, textAlign: 'center' },

  card: { backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 15, marginHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3 },
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