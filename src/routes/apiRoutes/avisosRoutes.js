const express = require('express');
const avisosController = require('../../controllers/avisosController');

const router = express.Router();

router.get('/', avisosController.getAllAvisos);
router.get('/scrape', avisosController.scrapeAvisosAndSave);

module.exports = router;
