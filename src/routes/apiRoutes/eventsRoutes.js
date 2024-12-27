const express = require('express'); // Importa el módulo de Express para manejar rutas y solicitudes HTTP.
const eventsController = require('../../controllers/eventsController'); // Controlador para gestionar los eventos.

const router = express.Router(); // Crea un nuevo enrutador de Express.

/**
 * Ruta para obtener todos los eventos almacenados.
 * Método: GET
 * Endpoint: /
 * Acción: Llama al método `getAllEvents` del controlador, que recupera todos los eventos desde la base de datos.
 */
router.get('/', eventsController.getAllEvents);

/**
 * Ruta para realizar el scraping de eventos y almacenarlos en la base de datos.
 * Método: GET
 * Endpoint: /scrape
 * Acción: Llama al método `scrapeEventsAndSave` del controlador, que realiza el scraping y guarda los eventos.
 */
router.get('/scrape', eventsController.scrapeEventsAndSave);

// Exporta el enrutador para su uso en otras partes de la aplicación.
module.exports = router;
