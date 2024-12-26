const db = require('../db/connection');

const saveAgendaEvents = async (events) => {
    const connection = await db.connect();

    const insertQuery = `
        INSERT INTO agenda_events (event_date, event_time, title, location)
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
                console.error('Error al guardar evento en la agenda:', { event_date, event_time, title }, error.message);
                results.push({ status: 'error', event, message: error.message });
            }
        }
    }

    await connection.end();
    return results;
};

const getAllAgendaEvents = async () => {
    const connection = await db.connect();
    try {
        const [rows] = await connection.execute('SELECT * FROM agenda_events');
        return rows;
    } catch (error) {
        console.error('Error al obtener eventos de la agenda:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
};

module.exports = { saveAgendaEvents, getAllAgendaEvents };
