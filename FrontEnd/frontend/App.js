import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// IMPORTACIONES
import LoginScreen from './src/Screens/LogInScreen';
import MenuScreen from './src/Screens/MenuScreen';
import NuevaOrden from './src/Screens/NuevaOrden';
import OrdenesActivas from './src/Screens/OrdenesActivas';
import MenuCategoriesScreen from './src/Screens/MenuCategoriesScreen'; 
import FoodMenuScreen from './src/Screens/FoodMenuScreen'; 
import ParaLlevarScreen from './src/Screens/ParaLlevarScreen'; 

import { OrderProvider } from './src/Context/OrderContext';

import OrderSummaryScreen from './src/Screens/OrderSummaryScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
   <OrderProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Inicio', headerBackVisible: false }} />
        <Stack.Screen name="NuevaOrden" component={NuevaOrden} options={{ title: 'Nueva Orden' }} />
        <Stack.Screen name="MenuCategories" component={MenuCategoriesScreen} options={{ title: 'Categorías' }} />
        <Stack.Screen name="FoodMenu" component={FoodMenuScreen} options={{ title: 'Platillos' }} />
        <Stack.Screen name="OrdenesActivas" component={OrdenesActivas} options={{ title: 'En Cocina' }} />
        <Stack.Screen name="ParaLlevar" component={ParaLlevarScreen} options={{ title: 'Para Llevar' }} />
        <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} options={{ title: 'Confirmar Orden' }} />
      </Stack.Navigator>
    </NavigationContainer>
  </OrderProvider> 
  );
}