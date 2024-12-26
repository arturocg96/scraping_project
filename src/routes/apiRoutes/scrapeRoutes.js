const express = require('express');
const scrapeController = require('../../controllers/scrapeController');

const router = express.Router();

router.get('/', scrapeController.scrapeAllAndSave);

module.exports = router;
