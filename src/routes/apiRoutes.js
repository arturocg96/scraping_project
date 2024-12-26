const express = require('express');
const eventsRoutes = require('./apiRoutes/eventsRoutes');
const agendaRoutes = require('./apiRoutes/agendaRoutes');
const scrapeRoutes = require('./apiRoutes/scrapeRoutes');

const router = express.Router();

router.use('/eventos', eventsRoutes);
router.use('/agenda', agendaRoutes);
router.use('/scrape', scrapeRoutes);

module.exports = router;
