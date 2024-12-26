const scrapeService = require('../services/scrapeService');
const eventsModel = require('../models/eventsModel');
const agendaModel = require('../models/agendaModel');

const scrapeAllAndSave = async (req, res) => {
    try {
        const events = await scrapeService.scrapeEvents();
        const eventResults = await eventsModel.saveEvents(events);

        const agendaEvents = await scrapeService.scrapeAgenda();
        const agendaResults = await agendaModel.saveAgendaEvents(agendaEvents);

        res.json({
            message: 'Scraping completo realizado',
            events: eventResults,
            agenda: agendaResults,
        });
    } catch (error) {
        console.error('Error en scrapeAllAndSave:', error.message);
        res.status(500).json({ error: 'Error al realizar el scraping completo' });
    }
};

module.exports = { scrapeAllAndSave };
