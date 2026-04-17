import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // El carrito temporal (lo que están pidiendo ahorita)
  const [orderItems, setOrderItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});

  //  Lista de órdenes ya confirmadas (para "Órdenes Activas")
  const [activeOrders, setActiveOrders] = useState([]);

  // Funciones del carrito temporal

  // Agg product
  const addItemsToOrder = (items) => {
    setOrderItems((prevItems) => [...prevItems, ...items]);
  };

  //  Restar cantidad 
  const decreaseItemQuantity = (index) => {
    setOrderItems(currentItems => {
      
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

  const removeItem = (indexToRemove) => {
    setOrderItems((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
  };

  // Limpiar el carrito temporal
  const clearOrder = () => {
    setOrderItems([]);
    setOrderInfo({});
  };

//Para guardar extras y recalcular precio 
  const updateItemExtras = (index, comentario, costoExtras) => {
    const newOrderItems = [...orderItems];
    const item = newOrderItems[index];

    // Guardamos el comentario y el costo de los extras
    item.comentario = comentario;
    item.costoExtras = costoExtras; 
    
    // Calculamos su nuevo precio unitario final (precio base + extras)
    item.priceFinal = item.price + costoExtras;

    setOrderItems(newOrderItems);
  };


  const updateItemPrice = (index, precioManual) => {
    const newOrderItems = [...orderItems];
    // Reemplazamos el precio final por el que escribieron manualmente
    newOrderItems[index].priceFinal = precioManual;
    setOrderItems(newOrderItems);
  };

  const finalizeOrder = () => {
    //  empaquetar todo el carro temporal
    const newFinishedOrder = {
        id: Date.now().toString(), // Creamos un ID único basado en la hora
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Hora actual
        info: orderInfo, // Mesa o Cliente
        items: orderItems, // Los platillos
        status: 'En Cocina' // Estado inicial
    };

    //  agg a las ordenes activas
    setActiveOrders(prevOrders => [newFinishedOrder, ...prevOrders]); // nuevas arriba

    //  Limpiamos el carrito para la siguiente mesa
    clearOrder();
  };

  // funcion para eliminar orden de la lista de ordenes activas (cuando se marca como "Entregada")
  const removeActiveOrder = (orderId) => {
    setActiveOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
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
      updateItemExtras,
      updateItemPrice,
      activeOrders, 
      finalizeOrder,
      removeActiveOrder 

    }}>
      {children}
    </OrderContext.Provider>
  );
};