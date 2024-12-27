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
 * @returns {Promise<Array>} - Array de resultados, donde cada resultado incluye:
 *   - status: Estado de la operación ('success', 'duplicate', 'error').
 *   - event: El evento procesado.
 *   - message: Detalles adicionales en caso de error.
 */
const saveEvents = async (events) => {
    const connection = await db.connect();

    // Consulta SQL para insertar eventos en la tabla 'events'.
    const insertQuery = `
        INSERT INTO events (event_date, event_time, title, location)
        VALUES (?, ?, ?, ?)
    `;

    const results = []; // Array para almacenar los resultados de cada operación.
    let duplicateCount = 0; // Contador de eventos duplicados.

    // Itera sobre cada evento en la lista proporcionada.
    for (const event of events) {
        const { event_date, event_time, title, location } = event;

        try {
            // Intenta insertar el evento en la base de datos.
            await connection.execute(insertQuery, [event_date, event_time, title, location]);
            results.push({ status: 'success', event }); // Inserción exitosa.
        } catch (error) {
            // Manejo de errores relacionados con eventos duplicados.
            if (error.code === 'ER_DUP_ENTRY') {
                duplicateCount++; // Incrementa el contador de duplicados.
                results.push({ status: 'duplicate', event });
            } else {
                // Manejo de errores no relacionados con duplicados.
                console.error(
                    'Error al guardar evento:',
                    { event_date, event_time, title },
                    error.message
                );
                results.push({ status: 'error', event, message: error.message });
            }
        }
    }

    // Mensaje de resumen si hubo eventos duplicados.
    if (duplicateCount > 0) {
        console.warn(`Eventos duplicados controlados y no almacenados: ${duplicateCount}`);
    }

    // Cierra la conexión con la base de datos.
    await connection.end();

    return results; // Devuelve los resultados del proceso de inserción.
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
        console.error('Error al obtener eventos:', error.message);
        throw error;
    } finally {
        // Asegura que la conexión se cierre, incluso si ocurre un error.
        await connection.end();
    }
};

// Exporta las funciones para que puedan ser utilizadas en otros módulos.
module.exports = { saveEvents, getAllEvents };
