import React, { useContext } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from "../../supabase_db/supabaseClient";
import { OrderContext } from '../Context/OrderContext'; 

export default function MenuScreen({ navigation }) { 

  const { userData } = useContext(OrderContext);
  
  // Extraemos el rol, convirtiéndolo a minúsculas para evitar errores (ej. "Cocinero" vs "cocinero")
  // Si por alguna razón falla, se asigna 'mesero' por seguridad.
  const miRol = userData?.rol?.toLowerCase() || 'mesero';

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

      {/* Saludo dinámico */}
      <Text style={styles.title}>¡Hola, {userData?.name || 'mesero'}!</Text> 
      <Text style={styles.subtitle}>Panel de: {miRol}</Text>

      {/* Opcion 1: Nueva Orden (Exclusivo para meseros y cajeros) */}
      {(miRol === 'mesero' || miRol === 'cajero') && (
        <TouchableOpacity 
          style={styles.buttonMain} 
          onPress={() => navigation.navigate('NuevaOrden')} 
        >
          <Text style={styles.textButton}> Nueva Orden</Text>
        </TouchableOpacity>
      )}

      {/* Opcion 2: Ver Órdenes Activas (Todos pueden verlo, pero el texto cambia para el cocinero) */}
      <TouchableOpacity 
        style={styles.buttonSecondary} 
        onPress={() => navigation.navigate('OrdenesActivas')} 
      >
        <Text style={styles.textButton}>
          {miRol === 'cocinero' ? 'Ver Pedidos de Cocina' : 'Ver Órdenes Activas'}
        </Text>
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
    textTransform: 'capitalize', // Hace que la primera letra del rol sea mayúscula
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