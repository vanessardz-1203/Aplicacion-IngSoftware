import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MenuScreen({ navigation }) {
  return (
    // 1. EL CONTENEDOR PRINCIPAL (Aquí controlas el fondo de toda la pantalla)
    <View style={styles.container}>

      {/*donde dice "mesero" hacer que se guarde el nombre de los meseros y luego mostrarlo ahí, ahorita solo es "mesero"*/}

      <Text style={styles.title}>¡Hola, Mesero!</Text> 
      <Text style={styles.subtitle}>¿Qué deseas hacer hoy?</Text>

      {/* OPCIÓN 1: Nueva Orden */}
      <TouchableOpacity 
        style={styles.buttonMain} 
        onPress={() => console.log('Ir a Nueva Orden')} // Aquí pondremos la navegación después
      >
        <Text style={styles.textButton}>📝 Nueva Orden</Text>
      </TouchableOpacity>

      {/* OPCIÓN 2: Ver Órdenes Activas */}
      <TouchableOpacity 
        style={styles.buttonSecondary} 
        onPress={() => console.log('Ir a Activas')}
      >
        <Text style={styles.textButton}> Ver Órdenes Activas</Text>
      </TouchableOpacity>

      {/* SEPARADOR (Espacio vacío para empujar el botón de salir abajo) */}
      <View style={{ flex: 1 }} />

      {/* OPCIÓN 3: Salir (Regresar al Login) */}
      <TouchableOpacity 
        style={styles.buttonExit} 
        onPress={() => navigation.navigate('Login')} // Esto te regresa al Login
      >
        <Text style={styles.textExit}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </View>
  );
}

// AQUÍ ESTÁ LA MAGIA DEL DISEÑO
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: '#6d63630c', // <--- CAMBIA EL COLOR DE FONDO AQUÍ (Gris clarito)
    padding: 45, // Espacio interno para que nada pegue con los bordes
    alignItems: 'center', // Centra todo horizontalmente
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  // Estilo para el botón principal (Nueva Orden)
  buttonMain: {
    backgroundColor: '#FF6347', // Color Tomate (puedes poner el naranja de los pollos)
    width: '100%',     // Que ocupe todo el ancho disponible
    padding: 15,       // Que tan "gordo" es el botón
    borderRadius: 10,  // Bordes redondeados
    alignItems: 'center',
    marginBottom: 15,  // Espacio debajo del botón
    elevation: 3,      // Sombra en Android
  },
  // Estilo para el botón secundario (Diferente color)
  buttonSecondary: {
    backgroundColor: '#4682B4', // Azul Acero
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  // Estilo para el botón de Salir (Más discreto)
  buttonExit: {
    borderColor: '#FF0000',
    borderWidth: 2,    // Solo borde, sin fondo
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  // Estilo del texto dentro de los botones de colores
  textButton: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Estilo del texto del botón salir
  textExit: {
    color: '#FF0000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});