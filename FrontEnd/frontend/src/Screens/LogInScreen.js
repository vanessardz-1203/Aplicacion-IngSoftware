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
        
        <TextInput 
          style={styles.input} 
          value={id} 
          onChangeText={setId} 
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
    backgroundColor: '#DF1111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    width:320,
    backgroundColor: "#DF1111",
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
    backgroundColor: "#e9de14",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },



});