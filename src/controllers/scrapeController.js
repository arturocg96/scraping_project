const scrapeService = require('../services/scrapeService'); // Servicio para realizar el scraping de eventos, agenda y avisos.
const eventsModel = require('../models/eventsModel'); // Modelo para la interacción con la base de datos de eventos generales.
const agendaModel = require('../models/agendaModel'); // Modelo para la interacción con la base de datos de eventos de agenda.
const avisosModel = require('../models/avisosModel'); // Modelo para la interacción con la base de datos de avisos.

/**
 * Controlador para realizar el scraping de eventos generales, eventos de agenda y avisos,
 * y almacenar los datos obtenidos en sus respectivas bases de datos.
 * 
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const scrapeAllAndSave = async (req, res) => {
    try {
        // Realiza el scraping de eventos generales y guarda los resultados.
        const events = await scrapeService.scrapeEvents();
        const eventResults = await eventsModel.saveEvents(events);

        // Realiza el scraping de eventos de agenda y guarda los resultados.
        const agendaEvents = await scrapeService.scrapeAgenda();
        const agendaResults = await agendaModel.saveAgendaEvents(agendaEvents);

        // Realiza el scraping de avisos y guarda los resultados.
        const avisos = await scrapeService.scrapeAvisos();
        const avisosResults = await avisosModel.saveAvisos(avisos);

        // Responde con un resumen de los resultados del scraping y almacenamiento.
        res.json({
            message: 'Scraping completo realizado',
            events: eventResults, // Resultados del procesamiento de eventos generales.
            agenda: agendaResults, // Resultados del procesamiento de eventos de agenda.
            avisos: avisosResults, // Resultados del procesamiento de avisos.
        });
    } catch (error) {
        // Maneja errores generales durante el proceso de scraping o almacenamiento.
        console.error('Error en scrapeAllAndSave:', error.message);
        res.status(500).json({ error: 'Error al realizar el scraping completo' }); // Envía una respuesta de error al cliente.
    }
};

// Exporta la función para que pueda ser utilizada en las rutas u otras partes de la aplicación.
module.exports = { scrapeAllAndSave };
