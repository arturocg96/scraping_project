const express = require('express');
const eventsController = require('../../controllers/eventsController');

const router = express.Router();

router.get('/', eventsController.getAllEvents);
router.get('/scrape', eventsController.scrapeEventsAndSave);

module.exports = router;
