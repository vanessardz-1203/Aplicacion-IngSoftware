import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';

export default function ModalComentarios({ visible, onClose, item, onSave }) {
  const [comentario, setComentario] = useState('');
  
  const [extraQueso, setExtraQueso] = useState(false);
  const [extraAguacate, setExtraAguacate] = useState(false);
  const [extraArroz, setExtraArroz] = useState(false);
  const [extraFrijoles, setExtraFrijoles] = useState(false);

  const [saborSeleccionado, setSaborSeleccionado] = useState(null);
  const SABORES = ['Jamaica', 'Limón', 'Piña', 'Tamarindo', 'Melón', 'Sandía'];
  
  useEffect(() => {
    setComentario('');
    setExtraQueso(false);
    setExtraAguacate(false);
    setExtraArroz(false);
    setExtraFrijoles(false);
    setSaborSeleccionado(null);
  }, [item]);

  if (!item) return null;

  const renderExtras = () => {
    const id = item.id || '';
    if (id.startsWith('be')) { // bebidas
      if (id === 'be5') {
        return (
          <View style={styles.extrasContainer}>
            <Text style={styles.tituloExtras}>Elige el Sabor:</Text>
            <View style={styles.saboresGrid}>
              {SABORES.map((sabor) => (
                <TouchableOpacity 
                  key={sabor}
                  style={[
                    styles.btnSabor, 
                    saborSeleccionado === sabor && styles.btnSaborActivo 
                  ]}
                  onPress={() => setSaborSeleccionado(sabor)}
                >
                  <Text style={[
                    styles.txtSabor, 
                    saborSeleccionado === sabor && styles.txtSaborActivo
                  ]}>
                    {sabor}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      }
      
      return <Text style={styles.notaGris}>Esta bebida no admite extras ni sabores.</Text>;
    }

    if (id.startsWith('bu') || id.startsWith('h')) { // burritos hamburguesas
      return (
        <View style={styles.extrasContainer}>
          <Text style={styles.tituloExtras}>Extras ($10 c/u):</Text>
          <View style={styles.filaExtra}>
            <Text style={styles.textoExtra}>Aguacate Extra</Text>
            <Switch value={extraAguacate} onValueChange={setExtraAguacate} />
          </View>
          <View style={styles.filaExtra}>
            <Text style={styles.textoExtra}>Queso Extra</Text>
            <Switch value={extraQueso} onValueChange={setExtraQueso} />
          </View>
        </View>
      );
    }

    if (id.startsWith('go')) { // gorditas
      return (
        <View style={styles.extrasContainer}>
          <Text style={styles.tituloExtras}>Extras Gorditas ($5 c/u):</Text>
          <View style={styles.filaExtra}>
            <Text style={styles.textoExtra}>Aguacate Extra</Text>
            <Switch value={extraAguacate} onValueChange={setExtraAguacate} />
          </View>
        </View>
      );
    }

    if (id.startsWith('po') || id.startsWith('ca')) { // pollos y carnes asadas
      return (
        <View style={styles.extrasContainer}>
          <Text style={styles.tituloExtras}>Porción Extra ($20 c/u):</Text>
          <View style={styles.filaExtra}>
            <Text style={styles.textoExtra}>Arroz Extra</Text>
            <Switch value={extraArroz} onValueChange={setExtraArroz} />
          </View>
          <View style={styles.filaExtra}>
            <Text style={styles.textoExtra}>Frijoles Extra</Text>
            <Switch value={extraFrijoles} onValueChange={setExtraFrijoles} />
          </View>
        </View>
      );
    }

    return null; 
  };

  const guardarCambios = () => {
    let costoTotalExtras = 0;
    let listaExtrasTextuales = []; 
    
    if (extraQueso) {
      costoTotalExtras += 10;
      listaExtrasTextuales.push("Queso Extra");
    }
    if (extraArroz) {
      costoTotalExtras += 20;
      listaExtrasTextuales.push("Arroz Extra");
    }
    if (extraFrijoles) {
      costoTotalExtras += 20;
      listaExtrasTextuales.push("Frijoles Extra");
    }
    if (extraAguacate) {
      costoTotalExtras += item.id.startsWith('go') ? 5 : 10;
      listaExtrasTextuales.push("Aguacate Extra");
    }

    let comentarioFinal = ''; 
    
    if (item.id === 'be5') {
      if (!saborSeleccionado) {
        alert("Por favor selecciona un sabor para el agua fresca.");
        return; 
      }
      comentarioFinal = comentario.trim() !== '' 
        ? `Sabor: ${saborSeleccionado} | Notas: ${comentario.trim()}` 
        : `Sabor: ${saborSeleccionado}`;
    } else {
      const textoDeSwitches = listaExtrasTextuales.length > 0 ? `${listaExtrasTextuales.join(', ')}` : '';
      const textoManual = comentario.trim();

      if (textoDeSwitches !== '' && textoManual !== '') {
        comentarioFinal = `Agregó: ${textoDeSwitches} | Notas: ${textoManual}`;
      } else if (textoDeSwitches !== '') {
        comentarioFinal = `Agregó: ${textoDeSwitches}`;
      } else {
        comentarioFinal = textoManual;
      }
    }

    onSave(comentarioFinal, costoTotalExtras);
  };

  return ( 
    <Modal visible={visible} animationType="slide" transparent={true}> 
      <View style={styles.fondoModal}>
        <View style={styles.cajaModal}>
          
          <Text style={styles.nombrePlatillo}>{item.name}</Text>
          <View style={styles.divider} />

          {renderExtras()}

          <Text style={styles.tituloExtras}>Comentarios / Instrucciones:</Text>
          <TextInput
            style={styles.inputArea}
            placeholder="Ej: Sin hielo, tostada más dura..."
            multiline={true}
            value={comentario}
            onChangeText={setComentario}
          />

          <View style={styles.botonesContainer}>
            <TouchableOpacity style={styles.btnCancelar} onPress={onClose}>
              <Text style={styles.txtBtnCancelar}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.btnGuardar} onPress={guardarCambios}>
              <Text style={styles.txtBtnGuardar}>Guardar Notas</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondoModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  cajaModal: { width: '85%', backgroundColor: 'white', borderRadius: 15, padding: 20, elevation: 10 },
  nombrePlatillo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  divider: { height: 1, backgroundColor: '#CCC', marginVertical: 10 },
  extrasContainer: { marginBottom: 15 },
  tituloExtras: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#444' },
  filaExtra: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  textoExtra: { fontSize: 16, color: '#555' },
  notaGris: { fontStyle: 'italic', color: '#888', marginBottom: 15, textAlign: 'center' },
  inputArea: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, height: 80, padding: 10, textAlignVertical: 'top', marginBottom: 20 },
  botonesContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  btnCancelar: { padding: 12, borderRadius: 8, backgroundColor: '#EEE', flex: 1, marginRight: 10, alignItems: 'center' },
  txtBtnCancelar: { color: '#555', fontWeight: 'bold' },
  btnGuardar: { padding: 12, borderRadius: 8, backgroundColor: '#4CAF50', flex: 1, marginLeft: 10, alignItems: 'center' },
  txtBtnGuardar: { color: 'white', fontWeight: 'bold' },

  saboresGrid: {  
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btnSabor: {
    width: '30%', 
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btnSaborActivo: {
    backgroundColor: '#4682B4', 
    borderColor: '#4682B4',
  },
  txtSabor: {
    color: '#555',
    fontSize: 14,
    fontWeight: 'bold',
  },
  txtSaborActivo: {
    color: 'white',
  },
});