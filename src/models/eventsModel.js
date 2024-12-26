const db = require('../db/connection');

/**
 * Guarda múltiples eventos en la base de datos.
 * Detecta duplicados y errores.
 */
const saveEvents = async (events) => {
    const connection = await db.connect();

    const insertQuery = `
        INSERT INTO events (event_date, event_time, title, location)
        VALUES (?, ?, ?, ?)
    `;

    const results = [];

    for (const event of events) {
        const { event_date, event_time, title, location } = event;        

        try {
            await connection.execute(insertQuery, [event_date, event_time, title, location]);
            results.push({ status: 'success', event });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                console.warn('Eventos duplicados controlados y no almacenados');
                results.push({ status: 'duplicate', event });
            } else {
                console.error('Error al guardar evento:', { event_date, event_time, title }, error.message);
                results.push({ status: 'error', event, message: error.message });
            }
        }
    }

    await connection.end();
    return results;
};

/**
 * Obtiene todos los eventos de la base de datos.
 */
const getAllEvents = async () => {
    const connection = await db.connect();
    try {
        const [rows] = await connection.execute('SELECT * FROM events');
        return rows;
    } catch (error) {
        console.error('Error al obtener eventos:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
};

module.exports = { saveEvents, getAllEvents };
