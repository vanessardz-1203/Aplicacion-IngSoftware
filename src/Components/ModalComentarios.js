import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';

export default function ModalComentarios({ visible, onClose, item, onSave }) {
  const [comentario, setComentario] = useState('');
  
  // Estados para los extras
  const [extraQueso, setExtraQueso] = useState(false);
  const [extraAguacate, setExtraAguacate] = useState(false);
  const [extraArroz, setExtraArroz] = useState(false);
  const [extraFrijoles, setExtraFrijoles] = useState(false);

  const [saborSeleccionado, setSaborSeleccionado] = useState(null);
  const SABORES = ['Jamaica', 'Limón', 'Piña', 'Tamarindo', 'Melón', 'Sandía'];
  
  // Cada vez que se abre el modal con un nuevo item, reseteamos los estados
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
    const id = item.id;

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
                    saborSeleccionado === sabor && styles.btnSaborActivo // Si está seleccionado, cambia de color
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
      
      // Si es cualquier otra bebida (Coca, Cerveza, etc.)
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

    let comentarioFinal = comentario; 
    
    if (item.id === 'be5') {
      if (!saborSeleccionado) {
        // Validar que seleccionen sabor
        alert("Por favor selecciona un sabor para el agua fresca.");
        return; 
      }
      // Si escribieron un comentario, lo unimos. Si no, solo mandamos el sabor.
      comentarioFinal = comentario.trim() !== '' 
        ? `Sabor: ${saborSeleccionado} | Notas: ${comentario}` 
        : `Sabor: ${saborSeleccionado}`;
    }

    // Le mandamos la info de regreso a la pantalla 
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




  saboresGrid: {  // nuevo para las cosas de los sabores de las aguas 
    flexDirection: 'row',
    flexWrap: 'wrap', // Esto hace que los botones bajen a la siguiente línea si no caben
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btnSabor: {
    width: '30%', // Caben 3 botones por fila
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