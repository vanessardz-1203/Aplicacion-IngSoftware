import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';

const icon = require('../../assets/images/LogoPollos.png');

export default function LogInScreen({ navigation }) {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={icon} style={{width: 300, height: 300}} />
        <StatusBar style="auto" />
        
        {/* Para ingresar el id del mesero */}
        <Text style={styles.label}>ID:</Text>
        <TextInput 
          style={styles.input} 
          value={id} 
          onChangeText={setId} 
          placeholder="Ingrese su ID"
        />
        
        {/* Para ingresar la contraseña del mesero */}
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput 
          style={styles.input} 
          value={password} 
          onChangeText={setPassword} 
          placeholder="Ingrese su contraseña"
          secureTextEntry //letras en puntitos jiji
        />

        <TouchableOpacity style={styles.button}
        onPressIn={() => navigation.navigate("Menu")}>
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
    backgroundColor: "#fff",
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
    backgroundColor: "#7fbf9f",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },



});