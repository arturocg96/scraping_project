const avisosModel = require('../models/avisosModel'); // Modelo para la interacción con la base de datos de avisos.
const scrapeService = require('../services/scrapeService'); // Servicio encargado de realizar el scraping de avisos.

/**
 * Controlador para realizar el scraping de avisos, guardar su contenido en la base de datos
 * y devolver un resumen de los resultados.
 *
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const { categorizeAviso } = require('../utils/categorizeUtils'); // Importa la función de categorización.

const scrapeAvisosAndSave = async (req, res) => {
    try {
        const avisos = await scrapeService.scrapeAvisos();

        for (const aviso of avisos) {
            if (aviso.link) {
                const { content } = await scrapeService.scrapeAvisoContent(aviso.link);
                aviso.content = content;
            } else {
                aviso.content = null;
            }

            // Categoriza el aviso utilizando la función reutilizable.
            aviso.category = categorizeAviso(aviso);
        }

        const { results, summary } = await avisosModel.saveAvisos(avisos);

        res.json({
            message: 'Scraping y almacenamiento de avisos completados',
            total_processed: avisos.length,
            saved: summary.saved.length,
            duplicates: summary.duplicates.length,
            errors: summary.errors,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al realizar scraping o guardar los avisos' });
    }
};


/**
 * Controlador para obtener todos los avisos almacenados en la base de datos.
 *
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const getAllAvisos = async (req, res) => {
    try {
        const avisos = await avisosModel.getAllAvisos();
        res.json(avisos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los avisos' });
    }
};

// Exporta los controladores para su uso en otros módulos.
module.exports = { scrapeAvisosAndSave, getAllAvisos };
