const avisosModel = require('../models/avisosModel'); // Modelo para la interacción con la base de datos de avisos.
const scrapeService = require('../services/scrapeService'); // Servicio encargado de realizar el scraping de avisos.

/**
 * Controlador para realizar el scraping de avisos, guardarlos en la base de datos
 * y devolver un resumen de los resultados.
 *
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const scrapeAvisosAndSave = async (req, res) => {
    try {
        // Realiza el scraping de avisos desde una fuente externa.
        const avisos = await scrapeService.scrapeAvisos();

        // Guarda los avisos en la base de datos a través del modelo y recibe los resultados del proceso.
        const results = await avisosModel.saveAvisos(avisos);

        // Clasifica los resultados según su estado: éxito, duplicados y errores.
        const saved = results.filter(result => result.status === 'success'); // Avisos guardados correctamente.
        const duplicates = results.filter(result => result.status === 'duplicate'); // Avisos duplicados no guardados.
        const errors = results.filter(result => result.status === 'error'); // Avisos con errores en el guardado.

        // Responde con un resumen detallado de los resultados.
        res.json({
            message: 'Scraping y almacenamiento de avisos completados',
            saved: saved.map(result => result.aviso), // Avisos exitosamente almacenados.
            duplicates: duplicates.map(result => result.aviso), // Avisos duplicados detectados.
            errors: errors.map(result => ({
                aviso: result.aviso,
                message: result.message, // Mensaje de error específico.
            })),
        });
    } catch (error) {
        // Maneja errores generales durante el scraping o el almacenamiento.
        console.error('Error en scrapeAvisosAndSave:', error.message);
        res.status(500).json({ error: 'Error al realizar scraping o guardar los avisos' }); // Respuesta con error al cliente.
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
        // Recupera todos los avisos desde el modelo.
        const avisos = await avisosModel.getAllAvisos();
        res.json(avisos); // Responde con los avisos obtenidos.
    } catch (error) {
        // Maneja errores durante la obtención de avisos.
        console.error('Error en getAllAvisos:', error.message);
        res.status(500).json({ error: 'Error al obtener los avisos' }); // Envía una respuesta con error al cliente.
    }
};

// Exporta los controladores para su uso en las rutas o en otras partes de la aplicación.
module.exports = { scrapeAvisosAndSave, getAllAvisos };
