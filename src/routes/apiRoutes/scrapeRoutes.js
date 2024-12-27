const express = require('express'); // Importa el módulo de Express para manejar rutas y solicitudes HTTP.
const scrapeController = require('../../controllers/scrapeController'); // Controlador que gestiona el scraping.

const router = express.Router(); // Crea un nuevo enrutador de Express.

/**
 * Ruta para realizar un scraping completo (eventos y agenda) y guardar los datos.
 * Método: GET
 * Endpoint: /
 * Acción: Llama al método `scrapeAllAndSave` del controlador, que ejecuta el scraping tanto para eventos generales como para la agenda, y almacena los datos en la base de datos.
 */
router.get('/', scrapeController.scrapeAllAndSave);

// Exporta el enrutador para su uso en otras partes de la aplicación.
module.exports = router;
