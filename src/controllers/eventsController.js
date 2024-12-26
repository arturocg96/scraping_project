const eventsModel = require('../models/eventsModel');
const scrapeService = require('../services/scrapeService');

const getAllEvents = async (req, res) => {
    try {
        const events = await eventsModel.getAllEvents();
        res.json(events);
    } catch (error) {
        console.error('Error en getAllEvents:', error.message);
        res.status(500).json({ error: 'Error al obtener los eventos' });
    }
};

const scrapeEventsAndSave = async (req, res) => {
    try {
        const events = await scrapeService.scrapeEvents();
        const results = await eventsModel.saveEvents(events);

        const saved = results.filter(result => result.status === 'success');
        const duplicates = results.filter(result => result.status === 'duplicate');
        const errors = results.filter(result => result.status === 'error');

        res.json({
            message: 'Scraping y almacenamiento completados',
            saved: saved.map(result => result.event),
            duplicates: duplicates.map(result => result.event),
            errors: errors.map(result => ({
                event: result.event,
                message: result.message,
            })),
        });
    } catch (error) {
        console.error('Error en scrapeEventsAndSave:', error.message);
        res.status(500).json({ error: 'Error al realizar scraping o guardar datos' });
    }
};

module.exports = { getAllEvents, scrapeEventsAndSave };
