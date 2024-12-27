const express = require('express'); // Importa el módulo de Express para manejar rutas y solicitudes HTTP.
const agendaController = require('../../controllers/agendaController'); // Controlador para la gestión de eventos de agenda.

const router = express.Router(); // Crea un nuevo enrutador de Express.

/**
 * Ruta para obtener todos los eventos de la agenda.
 * Método: GET
 * Endpoint: /
 * Acción: Llama al método `getAllAgendaEvents` del controlador, que devuelve todos los eventos almacenados en la base de datos.
 */
router.get('/', agendaController.getAllAgendaEvents);

/**
 * Ruta para realizar el scraping de eventos de agenda y almacenarlos en la base de datos.
 * Método: GET
 * Endpoint: /scrape
 * Acción: Llama al método `scrapeAgendaAndSave` del controlador, que realiza el scraping y guarda los eventos.
 */
router.get('/scrape', agendaController.scrapeAgendaAndSave);

// Exporta el enrutador para que pueda ser utilizado en otras partes de la aplicación.
module.exports = router;
