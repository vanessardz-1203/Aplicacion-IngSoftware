// src/data/MenuData.js
//pequeña base de datos de las cosas que tiene en el menu el restaurante
// CORREGIR poder agregar "extras" como guacamole extra, cebolla, etc
// y tambien agregar un boton de comentarios de los clientes
//tacos añadir la opcion de si en harina o maiz y queso o sin queso

export const MENU_DATA = {
    'Pollos Asados': [
      { id: 'po1', name: '1 Pollo Asado (entero)', price: 220, desc: 'Con arroz, frijoles, tortillas' },
      { id: 'po2', name: '1/2 Pollo Asado', price: 140, desc: 'Con arroz, frijoles, tortillas' },
      { id: 'po3', name: '1 1/2 Pollos Asados', price: 330, desc: 'Con arroz, frijoles, tortillas' },
      { id: 'po4', name: '1/4 Pollo Asado', price: 100, desc: 'Con arroz, frijoles, tortillas' },
    ],
    'Carne Asada': [
      { id: 'ca1', name: 'Orden de Carne', price: 150 },
      { id: 'ca2', name: '1/2 kg Carne Asada', price: 220, desc: 'Para 2 personas' },
      { id: 'ca3', name: '1 kg Carne Asada', price: 400, desc: 'Para 4 personas' },
    ],
    'Hamburguesas': [
      { id: 'h1', name: 'Hamburguesa Sencilla', price: 100 },
      { id: 'h2', name: 'Hamburguesa Doble', price: 130 },
      { id: 'h3', name: 'Hamburguesa Especial', price: 130 },
      { id: 'h4', name: 'Salchiburger', price: 130 },
    ],
    'Tacos': [
      { id: 't1', name: 'Taco Carne Asada', price: 23 },
      { id: 't2', name: 'Taco Asado de Puerco', price: 23},
      { id: 't3', name: 'Taco Guisado de Res', price: 23 },
      { id: 't4', name: 'Taco Picadillo', price: 23 },
      { id: 't5', name: 'Taco Carne de Puerco', price: 23 },
      { id: 't6', name: 'Taco Chicharrón de res', price: 23  },
      { id: 't7', name: 'Taco Pollo Deshebrado', price: 23  },
    ],
    'Burritos': [
      { id: 'bu1', name: 'Burrito Carne Asada con Queso', price: 110 },
      { id: 'bu2', name: 'Burrito Asado con frijoles', price: 100 },
      { id: 'bu3', name: 'Burrito Guisado de Res y frijoles', price: 100 },
      { id: 'bu4', name: 'Burrito Picadillo con frijoles', price: 100 },
      { id: 'bu5', name: 'Burrito Puerco Salsa verde y frijol', price: 100 },
      { id: 'bu6', name: 'Burrito Chicharrón de Res con frijoles', price: 100 },
      { id: 'bu7', name: 'Burrito Pollo Deshebrado con frijoles', price: 100 },
    ],
    'Empalmes': [
      { id: 'em1', name: 'Empalme Carne Asada', price: 100 },
      { id: 'em2', name: 'Empalme Asado', price: 90 },
      { id: 'em3', name: 'Empalme Guisado de Res', price: 90 },
      { id: 'em4', name: 'Empalme Picadillo', price: 90 },
      { id: 'em5', name: 'Empalme Puerco Salsa verde', price: 90 },
      { id: 'em6', name: 'Empalme Chicharrón de Res', price: 90 },
      { id: 'em7', name: 'Empalme Pollo Deshebrado', price: 90 },
    ],
    'Gorditas': [
      { id: 'go1', name: 'Gordita Carne Asada', price: 35 },
      { id: 'go2', name: 'Gordita Asado de Puerco', price: 35 },
      { id: 'go3', name: 'Gordita Guisado de Res', price: 35 },
      { id: 'go4', name: 'Gordita Picadillo', price: 35 },
      { id: 'go5', name: 'Gordita Chicharrón de Res', price: 35 },
      { id: 'go6', name: 'Gordita Puerco Salsa Verde', price: 35 },
      { id: 'go7', name: 'Gordita Pollo Deshebrado', price: 35 },
      { id: 'go8', name: 'Gordita de Frijol con Queso', price: 35 },
    ],

    'Papa Asada y Tostadas': [
      { id: 'PT1', name: 'Papa Asada', price: 100 },
      { id: 'PT2', name: 'Tostada', price: 27 },
    ],

    'Bebidas': [
      { id: 'be1', name: 'Coca Cola 500ml', price: 35 },
      { id: 'be2', name: 'Coca Cola Vidrio', price: 30 },
      { id: 'be3', name: 'Joya Sabores', price: 30 },
      { id: 'be4', name: 'Agua Natural 1lt', price: 30 },
      { id: 'be5', name: 'Aguas Frescas (Litro)', price: 45, desc: 'Jamaica, Limón, Piña, Tamarindo, Melón, Sandía'},
      { id: 'be6', name: 'Jugo de Naranja', price: 50 },
      { id: 'be7', name: 'Tecate', price: 25 },
      { id: 'be8', name: 'Café', price: 30},

    ],
    'Botanas y Extras': [
      { id: 'bo1', name: 'Papas a la Francesa', price: 40 },
      { id: 'bo2', name: 'Frijoles con Veneno', price: 40 },
      { id: 'bo3', name: 'Quesadillas', price: 13 },
      { id: 'bo4', name: 'Salchicha c/u', price: 15 },
      { id: 'bo5', name: 'Cebolla Asada c/u', price: 15 },
      { id: 'bo6', name: 'Tortilla de harina grande', price: 25 },
      { id: 'bo7', name: 'Tortilla de harina tostada', price: 25 },
    ],

    'Platillos': [
      { id: 'pl1', name: 'Asado de Puerco', price: 100 },
      { id: 'pl2', name: 'Guisado de Res', price: 100 },
      { id: 'pl3', name: 'Picadillo', price: 100 },
      { id: 'pl4', name: 'Chicharrón de Res', price: 100 },
      { id: 'pl5', name: 'Puerco Salsa Verde', price: 100 },
      { id: 'pl6', name: 'Pollo Deshebrado', price: 100 },
      { id: 'pl7', name: 'Chile Relleno Queso', price: 100 },
      { id: 'pl8', name: 'Chile Relleno Picadillo', price: 100 },
      { id: 'pl9', name: 'Orden de Menudo', price: 150 },  
    ],

      'Almuerzos': [
      { id: 'al1', name: 'Huevo a la Mexicana', price: 100 },
      { id: 'al2', name: 'Machacado', price: 100 },
      { id: 'al3', name: 'Huevos Rancheros', price: 100 },
      { id: 'al4', name: 'Huevos con Jamón', price: 100 },
      { id: 'al5', name: 'Papas con Huevo', price: 100 }, 
    ],



    'default': []
  };