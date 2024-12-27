require('dotenv').config(); // Carga las variables de entorno desde un archivo .env
const express = require('express'); // Importa el framework Express para construir aplicaciones web
const apiRoutes = require('./routes/apiRoutes'); // Importa las rutas de la API

const app = express(); // Crea una instancia de la aplicación Express

// Middleware para analizar cuerpos de solicitudes JSON
app.use(express.json());

// Define un prefijo para todas las rutas de la API
app.use('/api', apiRoutes);

// Exporta la aplicación para ser usada en otros módulos, como el servidor HTTP
module.exports = app;
