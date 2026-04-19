import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from "../../supabase_db/supabaseClient"

import { OrderContext } from '../Context/OrderContext';
import { useContext } from 'react';

const icon = require('../../assets/images/Logo restaurante circular.jpg');

export default function LogInScreen({ navigation }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const { setUserData } = useContext(OrderContext);

  const handleLogin = async () => {

    console.log("CLICK LOGIN")
    
    const { data, error } = await supabase
      .from ("users")
      .select("*")
      .eq("name", name)
      .eq("password", password)
      .single()
    console.log(data)
      
    console.log("data:", data)
    console.log("error:", error)

    if (error || !data) {
      alert("Datos incorrectos");
      return;
    }

    setUserData(data); // Guardamos los datos del usuario en el contexto

    const updateRes = await supabase
      .from("users")
      .update({ last_LogIn: new Date() })
      .eq("user_id", data.user_id)

    console.log("update:", updateRes.error)

    navigation.navigate("Menu")
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={icon} style={{width: 300, height: 300}} />
        <StatusBar style="auto" />
        
        {/* Para ingresar el id del mesero */}
        
        <TextInput 
          style={styles.input} 
          value={name} 
          onChangeText={setName} 
          placeholder="Ingrese su ID"
        />
        
        {/* Para ingresar la contraseña del mesero */}
        
        <TextInput 
          style={styles.input} 
          value={password} 
          onChangeText={setPassword} 
          placeholder="Ingrese su contraseña"
          secureTextEntry //letras en puntitos jiji
        />

        <TouchableOpacity style={styles.button}
        onPressIn={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
          
        </TouchableOpacity>

        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    width:320,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 25, //espacio interno
    alignItems: "center",
    elevation: 5, //sombra
  },

  input: {
    width: "100%",
    height: 45,
    backgroundColor: "#d2e8e3",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },

  button: {
    marginTop: 20,
    width: "100%",
    height: 50,
    backgroundColor: "#ffee00",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },



});