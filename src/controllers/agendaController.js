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
        // Realiza el scraping de eventos de la agenda.
        const agendaEvents = await scrapeService.scrapeAgenda();

        // Guarda los eventos en la base de datos.
        const results = await agendaModel.saveAgendaEvents(agendaEvents);

        // Clasifica los resultados.
        const saved = results.filter(result => result.status === 'success');
        const duplicates = results.filter(result => result.status === 'duplicate');
        const errors = results.filter(result => result.status === 'error');

        res.json({
            message: 'Scraping de eventos de la agenda completado',
            saved: saved.map(result => result.event),
            duplicates: duplicates.map(result => result.event),
            errors: errors.map(result => ({
                event: result.event,
                message: result.message,
            })),
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al realizar scraping o guardar eventos de la agenda' });
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
        res.status(500).json({ error: 'Error al obtener los eventos de la agenda' });
    }
};

// Exporta las funciones del controlador para que puedan ser utilizadas por otras partes de la aplicación.
module.exports = { scrapeAgendaAndSave, getAllAgendaEvents };
