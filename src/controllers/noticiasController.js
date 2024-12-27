const noticiasModel = require("../models/noticiasModel"); // Modelo para la interacción con la base de datos de noticias.
const scrapeService = require("../services/scrapeService"); // Servicio encargado de realizar el scraping de noticias.

/**
 * Controlador para realizar el scraping de noticias, guardarlas en la base de datos
 * y devolver un resumen del proceso.
 * 
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const scrapeNoticiasAndSave = async (req, res) => {
  try {
    // Realiza el scraping de noticias desde la fuente externa.
    const noticias = await scrapeService.scrapeNews();

    // Guarda las noticias en la base de datos y recibe los resultados del proceso.
    const results = await noticiasModel.saveNews(noticias);

    // Clasifica los resultados según su estado: éxito, duplicados y errores.
    const saved = results.filter((result) => result.status === "success"); // Noticias guardadas correctamente.
    const duplicates = results.filter((result) => result.status === "duplicate"); // Noticias duplicadas no guardadas.
    const errors = results.filter((result) => result.status === "error"); // Noticias con errores en el guardado.

    // Responde con un resumen detallado de los resultados.
    res.json({
      message: "Scraping de noticias completado",
      saved: saved.map((result) => result.article), // Noticias exitosamente almacenadas.
      duplicates: duplicates.map((result) => result.article), // Noticias duplicadas detectadas.
      errors: errors.map((result) => ({
        article: result.article,
        message: result.message, // Mensaje de error específico.
      })),
    });
  } catch (error) {
    // Maneja errores generales durante el scraping o el almacenamiento.
    console.error("Error en scrapeNoticiasAndSave:", error.message);
    res.status(500).json({ error: "Error al procesar las noticias" }); // Respuesta con error al cliente.
  }
};

/**
 * Controlador para obtener todas las noticias almacenadas en la base de datos.
 * 
 * @param {Request} req - Objeto de solicitud HTTP.
 * @param {Response} res - Objeto de respuesta HTTP.
 */
const getAllNoticias = async (req, res) => {
  try {
    // Recupera todas las noticias desde el modelo.
    const noticias = await noticiasModel.getAllNews();
    res.json(noticias); // Responde con las noticias obtenidas.
  } catch (error) {
    // Maneja errores durante la obtención de noticias.
    console.error("Error en getAllNoticias:", error.message);
    res.status(500).json({ error: "Error al obtener noticias" }); // Respuesta con error al cliente.
  }
};

// Exporta los controladores para su uso en las rutas u otras partes de la aplicación.
module.exports = { scrapeNoticiasAndSave, getAllNoticias };