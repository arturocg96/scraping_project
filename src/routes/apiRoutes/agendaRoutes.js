const express = require('express');
const agendaController = require('../../controllers/agendaController');

const router = express.Router();

router.get('/', agendaController.getAllAgendaEvents);
router.get('/scrape', agendaController.scrapeAgendaAndSave);

module.exports = router;
