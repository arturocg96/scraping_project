const avisosModel = require('../models/avisosModel'); // Modelo para la interacción con la base de datos de avisos.
const scrapeService = require('../services/scrapeService'); // Servicio encargado de realizar el scraping de avisos.

/**
 * Controlador para realizar el scraping de avisos, guardar su contenido en la base de datos
 * y devolver un resumen de los resultados.
 *
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const scrapeAvisosAndSave = async (req, res) => {
    try {
        // Realiza el scraping de los avisos.
        const avisos = await scrapeService.scrapeAvisos();

        for (const aviso of avisos) {
            if (aviso.link) {
                // Obtiene el contenido del aviso usando su enlace.
                const { content } = await scrapeService.scrapeAvisoContent(aviso.link);
                aviso.content = content;

                // Determina la categoría del aviso en base al título o subtítulo.
                if (aviso.title.toLowerCase().includes('tráfico') || aviso.title.toLowerCase().includes('circulación')) {
                    aviso.category = 'Tráfico';
                } else if (aviso.title.toLowerCase().includes('agua')) {
                    aviso.category = 'Suministros';
                } else if (aviso.title.toLowerCase().includes('infraestructura')) {
                    aviso.category = 'Infraestructuras';
                } else {
                    aviso.category = 'Sin categoría';
                }
            } else {
                aviso.content = null; // Si no hay enlace, el contenido será nulo.
                aviso.category = 'Sin categoría'; // Si no hay enlace, asigna una categoría por defecto.
            }
        }

        // Guarda los avisos en la base de datos y obtiene el resumen.
        const { results, summary } = await avisosModel.saveAvisos(avisos);

        // Responde con un resumen del proceso.
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
