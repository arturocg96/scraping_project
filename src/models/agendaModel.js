const db = require('../db/connection');

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
 * @returns {Promise<Array>} - Resultados del proceso de inserción, donde cada elemento del array contiene:
 *   - status: Estado del evento ('success', 'duplicate', 'skipped', 'error').
 *   - event: El evento procesado.
 *   - message: Mensaje adicional (solo para eventos con errores o incompletos).
 */
const saveAgendaEvents = async (events) => {
    const connection = await db.connect();

    // Consulta SQL para insertar un evento en la tabla 'agenda_events'.
    const insertQuery = `
        INSERT INTO agenda_events (event_date, event_time, title, location)
        VALUES (?, ?, ?, ?)
    `;

    const results = []; // Array para almacenar los resultados de cada operación.
    let duplicateCount = 0; // Contador para eventos duplicados.
    let skippedCount = 0;   // Contador para eventos incompletos.

    // Itera sobre cada evento en la lista proporcionada.
    for (const event of events) {
        const { event_date, event_time, title, location } = event;
        
        // Validación: Comprueba que todos los datos esenciales están presentes.
        if (!event_date || !event_time || !title || !location) {
            skippedCount++; // Incrementa el contador de eventos incompletos.
            results.push({
                status: 'skipped',
                event,
                message: 'Evento incompleto, no insertado'
            });
            continue; // Salta al siguiente evento en la lista.
        }

        try {
            // Intenta insertar el evento en la base de datos.
            await connection.execute(insertQuery, [event_date, event_time, title, location]);
            results.push({ status: 'success', event }); // Inserción exitosa.
        } catch (error) {
            // Si ocurre un error, verifica si es debido a un evento duplicado.
            if (error.code === 'ER_DUP_ENTRY') {      
                duplicateCount++; // Incrementa el contador de eventos duplicados.
                results.push({ status: 'duplicate', event });
            } else {
                // Manejo de errores no relacionados con duplicados.
                console.error(
                    'Error al guardar evento en la agenda:',
                    { event_date, event_time, title },
                    error.message
                );
                results.push({ status: 'error', event, message: error.message });
            }
        }
    }

    // Mensajes de resumen después de procesar todos los eventos.
    if (duplicateCount > 0) {
        console.warn(`Eventos duplicados controlados y no almacenados: ${duplicateCount}`);
    }
    if (skippedCount > 0) {
        console.warn(`Eventos incompletos que no se almacenaron: ${skippedCount}`);
    }

    // Cierra la conexión con la base de datos.
    await connection.end();

    return results; // Devuelve los resultados del proceso de inserción.
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
        const [rows] = await connection.execute('SELECT * FROM agenda_events');
        return rows; // Devuelve los registros obtenidos.
    } catch (error) {
        // Manejo de errores durante la recuperación de datos.
        console.error('Error al obtener eventos de la agenda:', error.message);
        throw error;
    } finally {
        // Asegura que la conexión se cierre incluso si ocurre un error.
        await connection.end();
    }
};

// Exporta las funciones para su uso en otros módulos.
module.exports = { saveAgendaEvents, getAllAgendaEvents };
