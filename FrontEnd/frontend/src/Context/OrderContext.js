import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // El carrito temporal (lo que están pidiendo ahorita)
  const [orderItems, setOrderItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});

  //  Lista de órdenes ya confirmadas (para "Órdenes Activas")
  const [activeOrders, setActiveOrders] = useState([]);

  // --- FUNCIONES DEL CARRITO TEMPORAL ---

  // Agregar productos al carrito
  const addItemsToOrder = (items) => {
    setOrderItems((prevItems) => [...prevItems, ...items]);
  };

  //  Restar cantidad de uno en uno (para el resumen)
  const decreaseItemQuantity = (index) => {
    setOrderItems(currentItems => {
      // Creamos una copia de la lista para no modificarla directamente
      const newItems = [...currentItems];
      // Si hay más de 1, restamos uno.
      if (newItems[index].quantity > 1) {
        newItems[index] = { ...newItems[index], quantity: newItems[index].quantity - 1 };
      } else {
        // Si solo queda 1 y le restan, lo borramos de la lista.
        newItems.splice(index, 1);
      }
      return newItems;
    });
  };

  // Borrar un renglón completo (por si acaso)
  const removeItem = (indexToRemove) => {
    setOrderItems((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
  };

  // Limpiar el carrito temporal
  const clearOrder = () => {
    setOrderItems([]);
    setOrderInfo({});
  };


  const finalizeOrder = () => {
    //  Empaquetamos todo lo del carrito en una "Orden Final"
    const newFinishedOrder = {
        id: Date.now().toString(), // Creamos un ID único basado en la hora
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Hora actual
        info: orderInfo, // Mesa o Cliente
        items: orderItems, // Los platillos
        status: 'En Cocina' // Estado inicial
    };

    //  La guardamos en la lista de "Órdenes Activas"
    setActiveOrders(prevOrders => [newFinishedOrder, ...prevOrders]); // Las nuevas arriba

    //  Limpiamos el carrito para la siguiente mesa
    clearOrder();
  };


  return (
    <OrderContext.Provider value={{ 
      orderItems, 
      orderInfo, 
      setOrderInfo,
      addItemsToOrder, 
      decreaseItemQuantity, 
      removeItem, 
      clearOrder,
      
      activeOrders, 
      finalizeOrder 
    }}>
      {children}
    </OrderContext.Provider>
  );
};