const eventsModel = require('../models/eventsModel'); // Modelo para la interacción con la base de datos de eventos.
const scrapeService = require('../services/scrapeService'); // Servicio encargado de realizar el scraping de eventos.

/**
 * Controlador para obtener todos los eventos almacenados en la base de datos.
 * 
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const getAllEvents = async (req, res) => {
    try {
        // Recupera todos los eventos desde el modelo.
        const events = await eventsModel.getAllEvents();
        res.json(events); // Responde con los eventos obtenidos.
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los eventos' }); // Envía una respuesta con error al cliente.
    }
};

/**
 * Controlador para realizar el scraping de eventos, guardarlos en la base de datos
 * y devolver un resumen de los resultados.
 * 
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const scrapeEventsAndSave = async (req, res) => {
    try {
        // Realiza el scraping de eventos.
        const events = await scrapeService.scrapeEvents();

        // Guarda los eventos en la base de datos y obtiene el resumen.
        const { results, summary } = await eventsModel.saveEvents(events);

        // Responde con un resumen del proceso.
        res.json({
            message: 'Scraping de eventos generales completado',
            total_processed: events.length,
            saved: summary.saved.length,
            duplicates: summary.duplicates.length,
            errors: summary.errors,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al realizar scraping o guardar eventos generales' });
    }
};

// Exporta los controladores para su uso en las rutas o en otras partes de la aplicación.
module.exports = { getAllEvents, scrapeEventsAndSave };
