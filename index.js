const app = require('./src/app.js'); // Importa la aplicación principal de Express
const http = require('http'); // Módulo HTTP de Node.js para crear un servidor

// Define el puerto en el que se ejecutará el servidor, usando una variable de entorno o un valor por defecto
const PORT = process.env.PORT || 3000;

// Crear el servidor HTTP usando la aplicación Express
const server = http.createServer(app);

// Inicia el servidor y comienza a escuchar en el puerto especificado
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); // Mensaje de confirmación al iniciar el servidor
});
