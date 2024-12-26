const agendaModel = require('../models/agendaModel');
const scrapeService = require('../services/scrapeService');

const scrapeAgendaAndSave = async (req, res) => {
    try {
        const agendaEvents = await scrapeService.scrapeAgenda();
        const results = await agendaModel.saveAgendaEvents(agendaEvents);

        const saved = results.filter(result => result.status === 'success');
        const duplicates = results.filter(result => result.status === 'duplicate');
        const errors = results.filter(result => result.status === 'error');

        res.json({
            message: 'Scraping y almacenamiento de la agenda completados',
            saved: saved.map(result => result.event),
            duplicates: duplicates.map(result => result.event),
            errors: errors.map(result => ({
                event: result.event,
                message: result.message,
            })),
        });
    } catch (error) {
        console.error('Error en scrapeAgendaAndSave:', error.message);
        res.status(500).json({ error: 'Error al realizar scraping o guardar los datos de la agenda' });
    }
};

const getAllAgendaEvents = async (req, res) => {
    try {
        const events = await agendaModel.getAllAgendaEvents();
        res.json(events);
    } catch (error) {
        console.error('Error en getAllAgendaEvents:', error.message);
        res.status(500).json({ error: 'Error al obtener los eventos de la agenda' });
    }
};

module.exports = { scrapeAgendaAndSave, getAllAgendaEvents };
