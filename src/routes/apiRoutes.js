const express = require('express'); // Importa Express para manejar rutas y middleware.
const eventsRoutes = require('./apiRoutes/eventsRoutes'); // Importa las rutas relacionadas con los eventos generales.
const agendaRoutes = require('./apiRoutes/agendaRoutes'); // Importa las rutas relacionadas con la agenda.
const scrapeRoutes = require('./apiRoutes/scrapeRoutes'); // Importa las rutas relacionadas con el scraping.
const avisosRoutes = require('./apiRoutes/avisosRoutes');
const noticiasRoutes = require("./apiRoutes/noticiasRoutes");

const router = express.Router(); // Crea un nuevo enrutador principal.

/**
 * Define los subrutas para cada recurso o funcionalidad de la aplicación.
 *
 * - `/eventos`: Gestiona rutas relacionadas con eventos generales.
 * - `/agenda`: Gestiona rutas relacionadas con la agenda de eventos.
 * - `/scrape`: Gestiona rutas para ejecutar procesos de scraping de datos.
 */
router.use('/eventos', eventsRoutes); // Monta las rutas de eventos bajo el prefijo `/eventos`.
router.use('/agenda', agendaRoutes); // Monta las rutas de agenda bajo el prefijo `/agenda`.
router.use('/scrape', scrapeRoutes); // Monta las rutas de scraping bajo el prefijo `/scrape`.
router.use('/avisos', avisosRoutes);
router.use("/noticias", noticiasRoutes);

// Exporta el enrutador principal para que sea utilizado en la configuración del servidor.
module.exports = router;
