import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';

export default function ModalComentarios({ visible, onClose, item, onSave }) {
  const [comentario, setComentario] = useState('');
  
  // Estados para los extras
  const [extraQueso, setExtraQueso] = useState(false);
  const [extraAguacate, setExtraAguacate] = useState(false);
  const [extraArroz, setExtraArroz] = useState(false);
  const [extraFrijoles, setExtraFrijoles] = useState(false);

  
  // Cada vez que se abre el modal con un nuevo item, reseteamos los estados
  useEffect(() => {
    setComentario('');
    setExtraQueso(false);
    setExtraAguacate(false);
    setExtraArroz(false);
    setExtraFrijoles(false);
  }, [item]);

  if (!item) return null;

  const renderExtras = () => {
    const id = item.id;

    if (id.startsWith('be')) { // bebidas
      return <Text style={styles.notaGris}>Las bebidas no admiten extras de comida.</Text>;
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

  // logica para calcular costos de los extras y agg al precio final, tambien mandar el comentario a la pantalla de resumen
  const guardarCambios = () => {
    let costoTotalExtras = 0;
    
    if (extraQueso) costoTotalExtras += 10;
    if (extraArroz) costoTotalExtras += 20;
    if (extraFrijoles) costoTotalExtras += 20;
    
    if (extraAguacate) {
      // El aguacate vale 5 en gorditas (go) y 10 en lo demás
      costoTotalExtras += item.id.startsWith('go') ? 5 : 10;
    }

    // Le mandamos la info de regreso a la pantalla 
    onSave(comentario, costoTotalExtras);
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
  txtBtnGuardar: { color: 'white', fontWeight: 'bold' }
});