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
        // Maneja errores durante la obtención de eventos.
        console.error('Error en getAllEvents:', error.message);
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
        // Realiza el scraping de eventos desde una fuente externa.
        const events = await scrapeService.scrapeEvents();

        // Guarda los eventos en la base de datos a través del modelo y recibe los resultados del proceso.
        const results = await eventsModel.saveEvents(events);

        // Clasifica los resultados según su estado: éxito, duplicados y errores.
        const saved = results.filter(result => result.status === 'success'); // Eventos guardados correctamente.
        const duplicates = results.filter(result => result.status === 'duplicate'); // Eventos duplicados no guardados.
        const errors = results.filter(result => result.status === 'error'); // Eventos con errores en el guardado.

        // Responde con un resumen detallado de los resultados.
        res.json({
            message: 'Scraping y almacenamiento completados',
            saved: saved.map(result => result.event), // Eventos exitosamente almacenados.
            duplicates: duplicates.map(result => result.event), // Eventos duplicados detectados.
            errors: errors.map(result => ({
                event: result.event, 
                message: result.message, // Mensaje de error específico.
            })),
        });
    } catch (error) {
        // Maneja errores generales durante el scraping o el almacenamiento.
        console.error('Error en scrapeEventsAndSave:', error.message);
        res.status(500).json({ error: 'Error al realizar scraping o guardar datos' }); // Respuesta con error al cliente.
    }
};

// Exporta los controladores para su uso en las rutas o en otras partes de la aplicación.
module.exports = { getAllEvents, scrapeEventsAndSave };
