const db = require("../db/connection");

/**
 * Guarda múltiples noticias en la base de datos.
 * Detecta noticias duplicadas y las maneja correctamente durante el proceso de inserción.
 * 
 * @param {Array} news - Lista de noticias a guardar.
 * @returns {Promise<Object>} Resultados del proceso de inserción y un resumen.
 */
const saveNews = async (news) => {
  const connection = await db.connect();

  // Consulta SQL para insertar noticias en la tabla 'news'.
  const insertQuery = `
    INSERT INTO news (title, raw_date, content, link)
    VALUES (?, ?, ?, ?)
  `;

  const results = []; // Array para almacenar los resultados de cada operación.

  // Itera sobre cada noticia en la lista proporcionada.
  for (const article of news) {
    const { title, rawDate, content, link } = article;

    // Valida que los campos obligatorios estén presentes.
    if (!title || !rawDate || !link) {
      results.push({ status: "skipped", article, message: "Datos incompletos" });
      continue; // Salta al siguiente artículo.
    }

    try {
      // Intenta insertar la noticia en la base de datos.
      await connection.execute(insertQuery, [title, rawDate, content, link]);
      results.push({ status: "success", article }); // Inserción exitosa.
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        results.push({ status: "duplicate", article }); // Registra el artículo como duplicado.
      } else {
        // Manejo de errores no relacionados con duplicados.
        results.push({ status: "error", article, message: error.message });
      }
    }
  }

  // Filtra los resultados para crear un resumen.
  const saved = results.filter((result) => result.status === "success");
  const duplicates = results.filter((result) => result.status === "duplicate");
  const errors = results.filter((result) => result.status === "error");

  console.info("\n==== RESUMEN DEL SCRAPING DE NOTICIAS - WEB AYTO ====");
  console.info("Scraping de noticias completado con éxito.\n");
  console.info("Resultados:");
  console.info(`- Total de noticias procesadas: ${news.length}`);
  console.info(`- Nuevas noticias almacenadas: ${saved.length}`);
  console.info(`- Noticias duplicadas: ${duplicates.length}`);
  console.info(`- Errores durante el proceso: ${errors.length}`);
  console.info(
    errors.length > 0
      ? "Errores detectados durante el proceso."
      : "No se detectaron errores durante el proceso."
  );
  console.info("============================\n");

  // Cierra la conexión con la base de datos.
  await connection.end();

  return { results, summary: { saved, duplicates, errors } }; // Devuelve los resultados y el resumen.
};

/**
 * Obtiene todas las noticias almacenadas en la tabla 'news'.
 * 
 * @returns {Promise<Array>} - Lista de todas las noticias de la base de datos.
 * @throws {Error} - Lanza un error si ocurre un problema al recuperar los datos.
 */
const getAllNews = async () => {
  const connection = await db.connect();
  try {
    // Ejecuta la consulta para recuperar todas las noticias.
    const [rows] = await connection.execute("SELECT * FROM news");
    return rows; // Devuelve los registros obtenidos.
  } catch (error) {
    // Manejo de errores durante la recuperación de datos.
    throw error;
  } finally {
    // Asegura que la conexión se cierre, incluso si ocurre un error.
    await connection.end();
  }
};

// Exporta las funciones para que puedan ser utilizadas en otros módulos.
module.exports = { saveNews, getAllNews };
