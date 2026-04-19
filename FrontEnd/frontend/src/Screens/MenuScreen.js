import React, { useContext } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from "../../supabase_db/supabaseClient";
import { OrderContext } from '../Context/OrderContext'; 

export default function MenuScreen({ navigation }) { 

  
  const { userData } = useContext(OrderContext);

  const handleLogOut = async () => {
    const { error } = await supabase
      .from("users")
      .update({ last_LogOut: new Date().toISOString() }) // Usamos ISO para evitar errores en SQL
      .eq("user_id", userData?.user_id); // Usamos el ID del contexto
    
    console.log("logout error:", error);
    navigation.navigate("Login");
  }

  return (
    <View style={styles.container}>

      
      <Text style={styles.title}>¡Hola, {userData?.name || 'Mesero'}!</Text> 
      <Text style={styles.subtitle}>¿Qué deseas hacer hoy?</Text>

      {/* Opcion 1: Nueva Orden */}
      <TouchableOpacity 
        style={styles.buttonMain} 
        onPress={() => navigation.navigate('NuevaOrden')} 
      >
        <Text style={styles.textButton}> Nueva Orden</Text>
      </TouchableOpacity>

      {/* Opcion 2: Ver Órdenes Activas */}
      <TouchableOpacity 
        style={styles.buttonSecondary} 
        onPress={() => navigation.navigate('OrdenesActivas')} 
      >
        <Text style={styles.textButton}> Ver Órdenes Activas</Text>
      </TouchableOpacity>

      {/* Separador */}
      <View style={{ flex: 1 }} />

      {/* Opcion 3: Salir */}
      <TouchableOpacity 
        style={styles.buttonExit} 
        onPress={handleLogOut} 
      >
        <Text style={styles.textExit}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6d63630c',
    padding: 45,
    alignItems: 'center',
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
  buttonMain: {
    backgroundColor: '#FF6347',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: '#4682B4',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  buttonExit: {
    borderColor: '#FF0000',
    borderWidth: 5,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textExit: {
    color: '#FF0000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});