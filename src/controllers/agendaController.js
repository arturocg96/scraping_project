const agendaModel = require('../models/agendaModel'); // Modelo que interactúa con la base de datos para gestionar eventos de la agenda.
const scrapeService = require('../services/scrapeService'); // Servicio para realizar el scraping de eventos.

/**
 * Controlador para realizar scraping de la agenda, guardar los eventos en la base de datos
 * y devolver un resumen de los resultados al cliente.
 * 
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const scrapeAgendaAndSave = async (req, res) => {
    try {
        // Realiza el scraping para obtener los eventos de la agenda.
        const agendaEvents = await scrapeService.scrapeAgenda();

        // Guarda los eventos obtenidos en la base de datos y recibe los resultados del proceso.
        const results = await agendaModel.saveAgendaEvents(agendaEvents);

        // Clasifica los resultados según su estado: éxito, duplicados y errores.
        const saved = results.filter(result => result.status === 'success');     // Eventos guardados correctamente.
        const duplicates = results.filter(result => result.status === 'duplicate'); // Eventos duplicados no guardados.
        const errors = results.filter(result => result.status === 'error');         // Eventos con errores en el guardado.

        // Responde con un resumen detallado de los resultados del proceso.
        res.json({
            message: 'Scraping y almacenamiento de la agenda completados',
            saved: saved.map(result => result.event), // Eventos exitosamente almacenados.
            duplicates: duplicates.map(result => result.event), // Eventos duplicados detectados.
            errors: errors.map(result => ({
                event: result.event, 
                message: result.message, // Mensaje de error específico para cada evento.
            })),
        });
    } catch (error) {
        // Maneja errores generales durante el scraping o el almacenamiento de los eventos.
        console.error('Error en scrapeAgendaAndSave:', error.message);
        res.status(500).json({ error: 'Error al realizar scraping o guardar los datos de la agenda' });
    }
};

/**
 * Controlador para obtener todos los eventos almacenados en la agenda desde la base de datos.
 * 
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const getAllAgendaEvents = async (req, res) => {
    try {
        // Recupera todos los eventos almacenados en la base de datos.
        const events = await agendaModel.getAllAgendaEvents();
        res.json(events); // Responde con los eventos obtenidos.
    } catch (error) {
        // Maneja errores durante la obtención de los eventos.
        console.error('Error en getAllAgendaEvents:', error.message);
        res.status(500).json({ error: 'Error al obtener los eventos de la agenda' });
    }
};

// Exporta las funciones del controlador para que puedan ser utilizadas por otras partes de la aplicación.
module.exports = { scrapeAgendaAndSave, getAllAgendaEvents };
