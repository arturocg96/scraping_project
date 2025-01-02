const db = require("../db/connection");

/**
 * Guarda múltiples eventos en la base de datos de agenda.
 * Controla eventos duplicados y descarta aquellos que están incompletos.
 *
 * @param {Array} events - Lista de eventos a guardar, cada uno con las propiedades:
 *   - event_date: Fecha del evento (requerido)
 *   - event_time: Hora del evento (requerido)
 *   - title: Título del evento (requerido)
 *   - location: Ubicación del evento (requerido)
 *
 * @returns {Promise<Object>} - Un objeto con el resumen del proceso y los resultados detallados:
 *   - results: Array con cada evento procesado.
 *   - summary: Resumen del proceso (nuevos, duplicados, errores).
 */
const saveAgendaEvents = async (events) => {
  const connection = await db.connect();

  // Consulta SQL para insertar un evento en la tabla 'agenda_events'.
  const insertQuery = `
        INSERT INTO agenda_events (event_date, event_time, title, location)
        VALUES (?, ?, ?, ?)
    `;

  const results = []; // Array para almacenar los resultados de cada operación.

  // Itera sobre cada evento en la lista proporcionada.
  for (const event of events) {
    const { event_date, event_time, title, location } = event;

    // Validación: Comprueba que todos los datos esenciales están presentes.
    if (!event_date || !event_time || !title || !location) {
      results.push({
        status: "skipped",
        event,
        message: "Evento incompleto, no insertado",
      });
      continue; // Salta al siguiente evento en la lista.
    }

    try {
      // Intenta insertar el evento en la base de datos.
      await connection.execute(insertQuery, [
        event_date,
        event_time,
        title,
        location,
      ]);
      results.push({ status: "success", event }); // Inserción exitosa.
    } catch (error) {
      // Si ocurre un error, verifica si es debido a un evento duplicado.
      if (error.code === "ER_DUP_ENTRY") {
        results.push({ status: "duplicate", event });
      } else {
        // Manejo de errores no relacionados con duplicados.
        results.push({ status: "error", event, message: error.message });
      }
    }
  }

  // Resumen del proceso.
  const saved = results.filter((result) => result.status === "success");
  const duplicates = results.filter((result) => result.status === "duplicate");
  const errors = results.filter((result) => result.status === "error");

  console.info("\n==== RESUMEN SCRAPING EVENTOS AYUNTAMIENTO - WEB AYTO ====");
  console.info("Scraping de eventos de la agenda completado con éxito.\n");
  console.info(`Resultados:`);
  console.info(`- Total de eventos procesados: ${events.length}`);
  console.info(`- Nuevos eventos almacenados: ${saved.length}`);
  console.info(`- Eventos duplicados: ${duplicates.length}`);
  console.info(`- Errores durante el proceso: ${errors.length}`);
  console.info(
    errors.length > 0
      ? "Errores detectados durante el proceso."
      : "No se detectaron errores durante el proceso."
  );
  console.info("============================\n");

  // Cierra la conexión con la base de datos.
  await connection.end();

  return {
    results,
    summary: {
      saved: saved.map((result) => result.event),
      duplicates: duplicates.map((result) => result.event),
      errors: errors.map((result) => ({
        event: result.event,
        message: result.message,
      })),
    },
  };
};

/**
 * Obtiene todos los eventos almacenados en la tabla 'agenda_events'.
 *
 * @returns {Promise<Array>} - Lista de todos los eventos en la base de datos.
 * @throws {Error} - Lanza un error si ocurre algún problema al obtener los datos.
 */
const getAllAgendaEvents = async () => {
  const connection = await db.connect();
  try {
    // Ejecuta la consulta para recuperar todos los eventos.
    const [rows] = await connection.execute("SELECT * FROM agenda_events");
    return rows; // Devuelve los registros obtenidos.
  } catch (error) {
    // Manejo de errores durante la recuperación de datos.
    throw error;
  } finally {
    // Asegura que la conexión se cierre incluso si ocurre un error.
    await connection.end();
  }
};

// Exporta las funciones para su uso en otros módulos.
module.exports = { saveAgendaEvents, getAllAgendaEvents };
