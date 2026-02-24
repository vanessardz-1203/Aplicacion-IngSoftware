import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


// Importamos las pantallas que acabamos de crear
import LogInScreen from './src/Screens/LogInScreen'; 
import MenuScreen from './src/Screens/MenuScreen';   
import NuevaOrden from './src/Screens/NuevaOrden';
import OrdenesActivas from './src/Screens/OrdenesActivas';
import ComerAquí from './src/Screens/ComerAquí';


const Stack = createNativeStackNavigator(); //para manejar la navegación entre pantallas

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        

        <Stack.Screen 
          name="Login" 
          component={LogInScreen} 
          options={{ headerShown: false }} // Ocultamos la barra de arriba en el login
        />
        
        <Stack.Screen 
          name="Menu" 
          component={MenuScreen} 
          options={{ title: 'Menú Principal' }} 
        />

        <Stack.Screen 
            name="NuevaOrden" 
            component={NuevaOrden} 
            options={{ title: 'Tipo de Orden' }} 
        />

        <Stack.Screen 
        name="OrdenesActivas" 
        component={OrdenesActivas} 
        options={{ title: 'Órdenes Activas' }} 
        />

        <Stack.Screen
        name="ComerAquí"
        component={ComerAquí}
        options={{ title: 'Comer Aquí' }} 
        />



      </Stack.Navigator>
    </NavigationContainer>
  );
}