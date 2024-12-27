const express = require('express'); // Importa el módulo Express para manejar rutas y middleware.
const avisosController = require('../../controllers/avisosController'); // Importa el controlador que gestiona las operaciones relacionadas con los avisos.

const router = express.Router(); // Crea una instancia de Router para definir rutas específicas.

/**
 * Ruta para obtener todos los avisos almacenados.
 * Método: GET
 * Endpoint: '/api/avisos/'
 * Controlador: avisosController.getAllAvisos
 */
router.get('/', avisosController.getAllAvisos);

/**
 * Ruta para realizar el scraping de avisos y guardarlos en la base de datos.
 * Método: GET
 * Endpoint: '/api/avisos/scrape'
 * Controlador: avisosController.scrapeAvisosAndSave
 */
router.get('/scrape', avisosController.scrapeAvisosAndSave);

// Exporta el router para que pueda ser utilizado en el módulo principal de rutas.
module.exports = router;
