# Sistema de Comandas - Pollos Asados La Central "El Tiko"

**Proyecto para la materia de Ingeniería de Software**
Aplicación móvil para la gestión y envío de órdenes remotas en tiempo real.

## 📄 Contexto y Problemática

El proyecto se desarrolla para el restaurante **"Pollos Asados La Central - El Tiko"**, ubicado en Montemorelos, Nuevo León.

Tras analizar el flujo de trabajo con el dueño del establecimiento, se identificó un cuello de botella crítico en la atención al cliente. Actualmente, los meseros toman las órdenes de forma manual (papel) o deben desplazarse hasta la caja principal dentro del local para ingresarlas en una computadora fija.

Esta dinámica presenta los siguientes problemas:
* **Pérdida de tiempo:** El traslado constante desde la zona de vehículos (drive-thru/exterior) hasta el interior del restaurante.
* **Margen de error:** Riesgo de errores al transcribir la orden o memorizar pedidos complejos.
* **Seguridad y Tráfico:** Flujo constante de personal entrando y saliendo, aumentando el riesgo de accidentes laborales.

**Solución Propuesta:**
Implementación de una aplicación móvil instalada en tabletas. Esto permitirá a los meseros capturar la orden directamente en la mesa o vehículo y enviarla digitalmente al sistema central de la cocina/caja, eliminando desplazamientos innecesarios y optimizando los tiempos de atención.

---

## 🛠 Justificación Técnica

A continuación se detalla la selección del stack tecnológico, priorizando la escalabilidad, eficiencia y facilidad de mantenimiento.

### Front-End: React Native + Expo
Se seleccionó **React Native** gestionado con **Expo** por las siguientes ventajas:
* **Desarrollo Ágil:** Gracias al *Hot Reloading*, podemos visualizar cambios en tiempo real en las tabletas sin necesidad de recompilar todo el proyecto constantemente.
* **Rendimiento Nativo:** A diferencia de una web tradicional, entrega una experiencia fluida (60fps) y mejor respuesta táctil, crucial para la rapidez que requieren los meseros.
* **Multiplataforma:** Aunque el enfoque inicial es Android (Tablets), el código base permite una futura expansión a iOS con mínimo esfuerzo.

### Back-End: Node.js + Express
El servidor funcionará como una API REST que conecta las tabletas con la base de datos.
* **Unificación del Lenguaje:** Al usar JavaScript tanto en el Frontend como en el Backend, reducimos la curva de aprendizaje y facilitamos la integración del equipo.
* **Eficiencia:** Node.js es ideal para aplicaciones de tiempo real que manejan múltiples peticiones simultáneas (varios meseros enviando comandas al mismo tiempo) sin bloquear el servidor.

### Base de Datos: MySQL
Optamos por un sistema de gestión relacional (RDBMS) por la naturaleza de los datos.
* **Integridad Referencial:** Es vital asegurar que ninguna orden quede "huérfana" (sin cliente o sin pago asociado) y que el inventario se descuente correctamente. MySQL ofrece la robustez necesaria para transacciones financieras.
* **Seguridad:** Permite una gestión estricta de usuarios y permisos, protegiendo la información sensible del negocio.

### Entorno de Desarrollo y Colaboración
* **Control de Versiones (GitHub):** Implementamos un flujo de trabajo colaborativo para gestionar el historial de cambios, facilitar la fusión de código (merges) y mantener un respaldo seguro del proyecto en la nube.
* **IDE (Visual Studio Code):** Elegido por su amplio ecosistema de extensiones (ESLint, Prettier, MySQL management) que estandarizan el estilo de código entre todos los integrantes del equipo.

---

## 🏗 Arquitectura del Proyecto

Para garantizar la mantenibilidad del código, se ha implementado una **Arquitectura Modular** separando las responsabilidades en carpetas independientes dentro del repositorio:

* `/frontend`: Contiene toda la lógica de la interfaz de usuario y comunicación con la API.
* `/backend`: Contiene la lógica del servidor, rutas y controladores.
* `/database`: Almacena los scripts SQL de creación y modelado de datos.

Esta estructura permite que los integrantes trabajen simultáneamente en diferentes capas del sistema (Back-End vs Front-End) minimizando conflictos de código y facilitando la depuración de errores.

---

## ⚙️ Pre-Requisitos e Instalación

Para ejecutar este proyecto de manera local, es necesario contar con las siguientes herramientas instaladas:

1.  **Node.js (versión LTS):** Entorno de ejecución para JavaScript.
2.  **Git:** Para clonar el repositorio.
3.  **MySQL Workbench:** Para gestionar la base de datos localmente.
4.  **Expo Go (App):** Instalada en tu celular/tablet para visualizar la aplicación.
5.  **Visual Studio Code:** Editor de código recomendado.

---

## 📸 Galería de Evidencias

En esta sección se documenta el entorno de desarrollo configurado y la integración del equipo.

> *[Imagen: Captura del entorno de VS Code]*

> *[Imagen: Captura de MySQL Workbench]*

> *[Imagen: Captura del Repositorio en GitHub]*

> *[Imagen: Captura de los colaboradores agregados]*

---

## 👥 Integrantes

**Trabajo realizado por el equipo #4:**

* Kenner - [Matrícula]
* Vanessa - [Matrícula]
* Sergio - [Matrícula]
* Samuel - [Matrícula]