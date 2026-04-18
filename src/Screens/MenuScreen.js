import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from "../../supabase_db/supabaseClient"

export default function MenuScreen({ navigation, route }) {

  const{ user } = route.params

  const handleLogOut = async () => {
    const { error } = await supabase
      .from("users")
      .update({ last_LogOut: new Date() })
      .eq("user_id", user.user_id)
    
    console.log("logout error:", error)

    navigation.navigate("Login")
  }

  return (
    // fondo de la pantalla
    <View style={styles.container}>

      {/*donde dice "mesero" hacer que se guarde el nombre de los meseros y luego mostrarlo ahí, ahorita solo es "mesero"*/}

      <Text style={styles.title}>¡Hola, {user.name}!</Text> 
      <Text style={styles.subtitle}>¿Qué deseas hacer hoy?</Text>

      {/* opcion 1: Nueva Orden */}
      <TouchableOpacity 
        style={styles.buttonMain} 
        onPress={() => navigation.navigate('NuevaOrden')} // Esto te lleva a la pantalla de Nueva Orden
      >
        <Text style={styles.textButton}> Nueva Orden</Text>
      </TouchableOpacity>

      {/* opcion 2: Ver Órdenes Activas */}
      <TouchableOpacity 
        style={styles.buttonSecondary} 
        onPress={() => navigation.navigate('OrdenesActivas')} // Esto te lleva a la pantalla de Órdenes Activas
      >
        <Text style={styles.textButton}> Ver Órdenes Activas</Text>
      </TouchableOpacity>

      {/* separador (Espacio vacío para empujar el boton de salir abajo) */}
      <View style={{ flex: 1 }} />

      {/* opcion 3: Salir (Regresar al Login) */}
      <TouchableOpacity 
        style={styles.buttonExit} 
        onPress={handleLogOut} // Esto te regresa al Login
      >
        <Text style={styles.textExit}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: '#6d63630c', // color del fondo
    padding: 45, // Espacio interno para que nada pegue con los bordes
    alignItems: 'center', // Centra todo horizontalmente
    paddingTop: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 17,
    color: '#666',
    marginBottom: 40,
  },
  // Estilo para el boton de nueva orden
  buttonMain: {
    backgroundColor: '#FF6347', // color rojito
    width: '100%',     // Que ocupe todo el ancho disponible
    padding: 15,       // Que tan gordo es el botón
    borderRadius: 10,  // Bordes redondeados
    alignItems: 'center',
    marginBottom: 15,  // Espacio debajo del botón
    elevation: 3,      // Sombra en Android
  },
  // Estilo para el botón de órdenes activas
  buttonSecondary: {
    backgroundColor: '#4682B4', // Azul 
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
    borderWidth: 5,    // Solo borde rojo
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