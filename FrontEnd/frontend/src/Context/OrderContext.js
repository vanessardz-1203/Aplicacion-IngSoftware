import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState({});
  const [userData, setUserData] = useState(null);

  const [activeOrders, setActiveOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null); 

  
  const [platoActivo, setPlatoActivo] = useState(0); 


  const addItemsToOrder = (items) => {
    setOrderItems((prevItems) => {
      let updatedItems = [...prevItems];

      items.forEach(newItem => {
        const existingIndex = updatedItems.findIndex(
          item => item.id === newItem.id && item.num_plato === platoActivo
        );

        if (existingIndex >= 0) {
          updatedItems[existingIndex].quantity += newItem.quantity;
        } else {
          
          updatedItems.push({ ...newItem, num_plato: platoActivo });
        }
      });

      return updatedItems;
    });
  };

  const decreaseItemQuantity = (index) => {
    setOrderItems(currentItems => {
      const newItems = [...currentItems];
      if (newItems[index].quantity > 1) {
        newItems[index] = { ...newItems[index], quantity: newItems[index].quantity - 1 };
      } else {
        newItems.splice(index, 1);
      }
      return newItems;
    });
  };

  const removeItem = (indexToRemove) => {
    setOrderItems((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
  };

  const clearOrder = () => {
    setOrderItems([]);
    setOrderInfo({});
    setPlatoActivo(0); 
  };

  const updateItemExtras = (index, comentario, costoExtras) => {
    const newOrderItems = [...orderItems];
    const item = newOrderItems[index];

    item.comentario = comentario;
    item.costoExtras = costoExtras; 
    item.priceFinal = item.price + costoExtras;

    setOrderItems(newOrderItems);
  };

  const updateItemPrice = (index, precioManual) => {
    const newOrderItems = [...orderItems];
    newOrderItems[index].priceFinal = precioManual;
    setOrderItems(newOrderItems);
  };

  const finalizeOrder = () => {
    if (editingOrderId) {
      const updatedOrders = activeOrders.map(order => 
        order.id === editingOrderId 
          ? { ...order, info: orderInfo, items: orderItems } 
          : order
      );
      setActiveOrders(updatedOrders);
      setEditingOrderId(null); 
    } else {
      const newFinishedOrder = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        info: orderInfo,
        items: orderItems,
        status: 'En Cocina'
      };
      setActiveOrders([...activeOrders, newFinishedOrder]);
    }

    setOrderInfo({});
    setOrderItems([]);
    setPlatoActivo(0); 
  };

  const removeActiveOrder = (orderId) => {
    setActiveOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  const loadOrderForEditing = (order) => {
    setOrderInfo(order.info);
    setOrderItems(order.items);
    setEditingOrderId(order.id); 
    setPlatoActivo(0); 
  };

  return (
    <OrderContext.Provider value={{ 
      userData, 
      setUserData,
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
      editingOrderId,
      platoActivo,
      setPlatoActivo
    }}>
      {children}
    </OrderContext.Provider>
  );
};