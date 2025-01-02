const db = require('../db/connection');

/**
 * Guarda múltiples eventos en la base de datos.
 * Detecta eventos duplicados basados en restricciones únicas de la tabla
 * y maneja errores durante el proceso de inserción.
 * 
 * @param {Array} events - Lista de eventos a insertar, cada uno con las propiedades:
 *   - event_date: Fecha del evento (requerido).
 *   - event_time: Hora del evento (requerido).
 *   - title: Título del evento (requerido).
 *   - location: Ubicación del evento (requerido).
 * 
 * @returns {Promise<Object>} - Resultados del proceso de inserción y resumen del proceso.
 */
const saveEvents = async (events) => {
    const connection = await db.connect();

    // Consulta SQL para insertar eventos en la tabla 'events'.
    const insertQuery = `
        INSERT INTO events (event_date, event_time, title, location)
        VALUES (?, ?, ?, ?)
    `;

    const results = []; // Array para almacenar los resultados de cada operación.

    for (const event of events) {
        const { event_date, event_time, title, location } = event;

        try {
            // Intenta insertar el evento en la base de datos.
            await connection.execute(insertQuery, [event_date, event_time, title, location]);
            results.push({ status: 'success', event }); // Inserción exitosa.
        } catch (error) {
            // Manejo de errores relacionados con eventos duplicados.
            if (error.code === 'ER_DUP_ENTRY') {
                results.push({ status: 'duplicate', event });
            } else {
                // Manejo de errores no relacionados con duplicados.
                results.push({ status: 'error', event, message: error.message });
            }
        }
    }

    // Filtra los resultados para generar un resumen.
    const saved = results.filter(result => result.status === 'success');
    const duplicates = results.filter(result => result.status === 'duplicate');
    const errors = results.filter(result => result.status === 'error');

    console.info('\n==== RESUMEN SCRAPING EVENTOS - WEB AYTO ====');
    console.info('Scraping de eventos generales completado con éxito.\n');
    console.info(`Resultados:`);
    console.info(`- Total de eventos procesados: ${events.length}`);
    console.info(`- Nuevos eventos almacenados: ${saved.length}`);
    console.info(`- Eventos duplicados: ${duplicates.length}`);
    console.info(`- Errores durante el proceso: ${errors.length}`);
    console.info(errors.length > 0 ? 'Errores detectados durante el proceso.' : 'No se detectaron errores durante el proceso.');
    console.info('============================\n');

    await connection.end();

    return { results, summary: { saved, duplicates, errors } };
};

/**
 * Obtiene todos los eventos almacenados en la tabla 'events'.
 * 
 * @returns {Promise<Array>} - Lista de todos los eventos de la base de datos.
 * @throws {Error} - Lanza un error si ocurre un problema al recuperar los datos.
 */
const getAllEvents = async () => {
    const connection = await db.connect();
    try {
        // Ejecuta la consulta para recuperar todos los eventos.
        const [rows] = await connection.execute('SELECT * FROM events');
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
module.exports = { saveEvents, getAllEvents };
