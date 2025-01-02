const db = require("../db/connection");

/**
 * Guarda múltiples avisos en la base de datos.
 * Controla duplicados y valida los datos antes de intentar insertarlos.
 *
 * @param {Array} avisos - Lista de avisos a guardar, cada uno con las propiedades:
 *   - title: Título del aviso (requerido)
 *   - subtitle: Subtítulo del aviso (opcional)
 *   - link: Enlace al aviso (opcional)
 *   - content: Contenido del aviso (opcional)
 *   - category: Categoría del aviso (opcional)
 *
 * @returns {Promise<Object>} - Resultados del proceso de inserción y resumen del proceso.
 */
const saveAvisos = async (avisos) => {
  const connection = await db.connect();

  const insertQuery = `
        INSERT INTO avisos (title, subtitle, link, content, category)
        VALUES (?, ?, ?, ?, ?)
    `;

  const results = [];

  for (const aviso of avisos) {
    const { title, subtitle, link, content, category } = aviso;

    try {
      await connection.execute(insertQuery, [
        title,
        subtitle || null,
        link || null,
        content || null,
        category || "Sin categoría",
      ]);
      results.push({ status: "success", aviso });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        results.push({ status: "duplicate", aviso });
      } else {
        results.push({ status: "error", aviso, message: error.message });
      }
    }
  }

  // Filtra los resultados para crear un resumen.
  const saved = results.filter((result) => result.status === "success");
  const duplicates = results.filter((result) => result.status === "duplicate");
  const errors = results.filter((result) => result.status === "error");

  console.log(`\n==== RESUMEN SCRAPING AVISOS  - WEB AYTO ====
Scraping completado con éxito.

Resultados:
- Total de avisos procesados: ${avisos.length}
- Nuevos avisos almacenados: ${saved.length}
- Avisos duplicados: ${duplicates.length}
- Errores durante el proceso: ${errors.length}

${
  errors.length > 0
    ? `Errores detectados:\n${errors
        .map((err) => `  - Título: ${err.aviso.title} | Motivo: ${err.message}`)
        .join("\n")}`
    : "No se detectaron errores durante el proceso."
}
============================\n`);

  await connection.end();
  return { results, summary: { saved, duplicates, errors } };
};

/**
 * Obtiene todos los avisos almacenados en la base de datos.
 *
 * @returns {Promise<Array>} - Lista de todos los avisos en la base de datos.
 * @throws {Error} - Lanza un error si ocurre algún problema durante la consulta.
 */
const getAllAvisos = async () => {
  const connection = await db.connect();

  try {
    const [rows] = await connection.execute("SELECT * FROM avisos");
    return rows;
  } catch (error) {
    throw error;
  } finally {
    await connection.end();
  }
};

// Exporta las funciones para su uso en otros módulos.
module.exports = { saveAvisos, getAllAvisos };
