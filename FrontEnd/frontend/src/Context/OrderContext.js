import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  // El carrito temporal (lo que están pidiendo ahorita)
  const [orderItems, setOrderItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});


  const [userData, setUserData] = useState(null);

  //  Lista de órdenes ya confirmadas (para "Órdenes Activas")
  const [activeOrders, setActiveOrders] = useState([]);

  const [editingOrderId, setEditingOrderId] = useState(null); // estado para recordar la orden que se esta editando

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
    if (editingOrderId) {
      // Buscar la ordemn que se está editando y actualizarla en lugar de crear una nueva
      const updatedOrders = activeOrders.map(order => 
        order.id === editingOrderId 
          ? { ...order, info: orderInfo, items: orderItems } 
          : order
      );
      setActiveOrders(updatedOrders);
      setEditingOrderId(null); // Limpiamos el modo edición
    } else {
      // Lo que se tenía antes
      const newFinishedOrder = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        info: orderInfo,
        items: orderItems,
        status: 'En Cocina'
      };
      setActiveOrders([...activeOrders, newFinishedOrder]);
    }

    // Limpiamos todo al terminar
    setOrderInfo({});
    setOrderItems([]);
  };

  // funcion para eliminar orden de la lista de ordenes activas (cuando se marca como "Entregada")
  const removeActiveOrder = (orderId) => {
    setActiveOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  // funcion para cargar una orden activa al carrito temporal (cuando se quiere editar una orden ya enviada a cocina)
  const loadOrderForEditing = (order) => {
    setOrderInfo(order.info);
    setOrderItems(order.items);
    setEditingOrderId(order.id); // Guardamos su ID para no duplicarla después
  };


  return (
    <OrderContext.Provider value={{ 
      userData, 
      setUserData,
      orderItems,
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
      removeActiveOrder, 
      loadOrderForEditing,
      editingOrderId
      
    }}>
      {children}
    </OrderContext.Provider>
  );
};