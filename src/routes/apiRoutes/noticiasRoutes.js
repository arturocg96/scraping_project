const express = require("express");
const noticiasController = require("../../controllers/noticiasController"); // Ruta correcta

const router = express.Router();

router.get("/", noticiasController.getAllNoticias);
router.get("/scrape", noticiasController.scrapeNoticiasAndSave);

module.exports = router;
