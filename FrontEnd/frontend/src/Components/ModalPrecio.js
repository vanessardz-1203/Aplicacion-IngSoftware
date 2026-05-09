import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function ModalPrecio({ visible, onClose, item, onSave }) { // Recibimos el item para mostrar su nombre y precio actual, y onSave para enviar el nuevo precio al padre
  const [nuevoPrecio, setNuevoPrecio] = useState('');

  // Cuando se abre el modal, ponemos el precio actual en la cajita
  useEffect(() => {
    if (item) {
      const precioActual = item.priceFinal ? item.priceFinal : item.price;
      setNuevoPrecio(precioActual.toString());
    }
  }, [item]);

  if (!item) return null; // Si no hay item, no mostramos nada

  const guardar = () => { // Validamos que el nuevo precio sea un número válido
    const precioNumerico = parseFloat(nuevoPrecio);
    if (isNaN(precioNumerico) || precioNumerico < 0) {
      alert("Por favor ingresa un precio válido.");
      return;
    }
    onSave(precioNumerico); // Enviamos el nuevo precio al componente padre
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}> 
      <View style={styles.fondoModal}>
        <View style={styles.cajaModal}>
          
          <Text style={styles.titulo}>Ajustar Precio Manual</Text>
          <Text style={styles.subtitulo}>{item.name}</Text>
          
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={nuevoPrecio}
            onChangeText={setNuevoPrecio}
            autoFocus={true}
          />

          <View style={styles.botonesContainer}>
            <TouchableOpacity style={styles.btnCancelar} onPress={onClose}>
              <Text style={styles.txtBtnCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnGuardar} onPress={guardar}>
              <Text style={styles.txtBtnGuardar}>Guardar Precio</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondoModal: { 
    flex: 1,
     backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
       alignItems: 'center' },

  cajaModal: { 
    width: '80%',
     backgroundColor: 'white',
      borderRadius: 15,
       padding: 20,
        elevation: 10 },

  titulo: { 
    fontSize: 20,
     fontWeight: 'bold',
      textAlign: 'center',
       color: '#D32F2F' },

  subtitulo: {
     fontSize: 16,
     textAlign: 'center',
      color: '#666',
       marginBottom: 15 },

  input: { 
    fontSize: 24,
     fontWeight: 'bold',
      borderWidth: 1,
       borderColor: '#CCC', 
       borderRadius: 8,
        padding: 10,
         textAlign: 'center',
          marginBottom: 20,
           color: '#333' },

  botonesContainer: { 
    flexDirection: 'row',
     justifyContent: 'space-between' },

  btnCancelar: {
     padding: 12,
     borderRadius: 8,
      backgroundColor: '#EEE',
       flex: 1, marginRight: 10,
        alignItems: 'center' },

  txtBtnCancelar: { 
    color: '#555',
     fontWeight: 'bold' },

  btnGuardar: { 
    padding: 12,
     borderRadius: 8,
      backgroundColor: '#D32F2F',
       flex: 1,
        marginLeft: 10,
         alignItems: 'center' },

  txtBtnGuardar: { 
    color: 'white',
     fontWeight: 'bold' }

});