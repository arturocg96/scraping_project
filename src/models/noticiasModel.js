const db = require("../db/connection");

/**
 * Guarda múltiples noticias en la base de datos.
 * Detecta noticias duplicadas y las maneja correctamente durante el proceso de inserción.
 * 
 * @param {Array} news - Lista de noticias a guardar.
 * @returns {Promise<Array>} Resultados del proceso de inserción.
 */
const saveNews = async (news) => {
  const connection = await db.connect();

  // Consulta SQL para insertar noticias en la tabla 'news'.
  const insertQuery = `
    INSERT INTO news (title, raw_date, content, link)
    VALUES (?, ?, ?, ?)
  `;

  const results = []; // Array para almacenar los resultados de cada operación.
  let duplicateCount = 0; // Contador de noticias duplicadas.
  let skippedCount = 0; // Contador de noticias incompletas.

  // Itera sobre cada noticia en la lista proporcionada.
  for (const article of news) {
    const { title, rawDate, content, link } = article;

    // Valida que los campos obligatorios estén presentes.
    if (!title || !rawDate || !link) {
      skippedCount++; // Incrementa el contador de noticias incompletas.
      results.push({ status: "skipped", article, message: "Datos incompletos" });
      continue; // Salta al siguiente artículo.
    }

    try {
      // Intenta insertar la noticia en la base de datos.
      await connection.execute(insertQuery, [title, rawDate, content, link]);
      results.push({ status: "success", article }); // Inserción exitosa.
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        duplicateCount++; // Incrementa el contador de duplicados.
        results.push({ status: "duplicate", article }); // Registra el artículo como duplicado.
      } else {
        // Manejo de errores no relacionados con duplicados.
        console.error("Error al guardar noticia:", { title, rawDate, link }, error.message);
        results.push({ status: "error", article, message: error.message });
      }
    }
  }

  // Mensajes de resumen si hubo noticias duplicadas o incompletas.
  if (duplicateCount > 0) {
    console.warn(`Noticias duplicadas controladas y no almacenadas: ${duplicateCount}`);
  }
  if (skippedCount > 0) {
    console.warn(`Noticias incompletas que no se almacenaron: ${skippedCount}`);
  }

  // Cierra la conexión con la base de datos.
  await connection.end();

  return results; // Devuelve los resultados del proceso de inserción.
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
    console.error("Error al obtener noticias:", error.message);
    throw error;
  } finally {
    // Asegura que la conexión se cierre, incluso si ocurre un error.
    await connection.end();
  }
};

// Exporta las funciones para que puedan ser utilizadas en otros módulos.
module.exports = { saveNews, getAllNews };
