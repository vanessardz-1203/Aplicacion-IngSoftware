import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos las pantallas que acabamos de crear
import LoginScreen from './src/Screens/LogInScreen'; // Tu amiga trabaja aquí
import MenuScreen from './src/Screens/MenuScreen';   // Tú trabajas aquí

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        {/* Pantalla 1: Login */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} // Ocultamos la barra de arriba en el login
        />
        
        {/* Pantalla 2: Tu Menú */}
        <Stack.Screen 
          name="Menu" 
          component={MenuScreen} 
          options={{ title: 'Menú Principal' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}