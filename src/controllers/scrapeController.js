const scrapeService = require('../services/scrapeService'); // Servicio para realizar el scraping de eventos, agenda y avisos.
const eventsModel = require('../models/eventsModel'); // Modelo para la interacción con la base de datos de eventos generales.
const agendaModel = require('../models/agendaModel'); // Modelo para la interacción con la base de datos de eventos de agenda.
const avisosModel = require('../models/avisosModel'); // Modelo para la interacción con la base de datos de avisos.
const newsModel = require('../models/noticiasModel'); // Modelo para la interacción con la base de datos de noticias.

/**
 * Controlador para realizar el scraping de eventos generales, eventos de agenda, avisos y noticias,
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

        // Realiza el scraping de avisos y procesa el contenido de cada aviso.
        const avisos = await scrapeService.scrapeAvisos();
        for (const aviso of avisos) {
            if (aviso.link) {
                // Extrae el contenido del aviso desde el enlace.
                const { content } = await scrapeService.scrapeAvisoContent(aviso.link);
                aviso.content = content; // Asigna el contenido extraído al aviso.
            } else {
                aviso.content = null; // Si no hay enlace, no hay contenido.
            }
        }
        const avisosResults = await avisosModel.saveAvisos(avisos);

        // Realiza el scraping de noticias y guarda los resultados.
        const news = await scrapeService.scrapeNews();
        const newsResults = await newsModel.saveNews(news);

        // Responde con un resumen de los resultados del scraping y almacenamiento.
        res.json({
            message: 'Scraping completo realizado',
            events: eventResults, // Resultados del procesamiento de eventos generales.
            agenda: agendaResults, // Resultados del procesamiento de eventos de agenda.
            avisos: avisosResults, // Resultados del procesamiento de avisos con contenido.
            news: newsResults, // Resultados del procesamiento de noticias.
        });
    } catch (error) {
        // Maneja errores generales durante el proceso de scraping o almacenamiento.
        console.error('Error en scrapeAllAndSave:', error.message);
        res.status(500).json({ error: 'Error al realizar el scraping completo' }); // Envía una respuesta de error al cliente.
    }
};

// Exporta la función para que pueda ser utilizada en las rutas u otras partes de la aplicación.
module.exports = { scrapeAllAndSave };
