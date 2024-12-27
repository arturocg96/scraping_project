const db = require('../db/connection');

/**
 * Guarda múltiples avisos en la base de datos.
 * Controla duplicados y valida los datos antes de intentar insertarlos.
 * 
 * @param {Array} avisos - Lista de avisos a guardar, cada uno con las propiedades:
 *   - title: Título del aviso (requerido)
 *   - subtitle: Subtítulo del aviso (opcional)
 *   - link: Enlace al aviso (opcional)
 * 
 * @returns {Promise<Array>} - Resultados del proceso de inserción, donde cada elemento contiene:
 *   - status: Estado del aviso ('success', 'duplicate', 'skipped', 'error').
 *   - aviso: El aviso procesado.
 *   - message: Mensaje adicional (solo para errores o avisos incompletos).
 */
const saveAvisos = async (avisos) => {
    const connection = await db.connect();

    const insertQuery = `
        INSERT INTO avisos (title, subtitle, link)
        VALUES (?, ?, ?)
    `;

    const results = [];
    let duplicateCount = 0;
    let skippedCount = 0;

    for (const aviso of avisos) {
        const { title, subtitle, link } = aviso;

        // Validación: Verifica que el aviso tiene un título.
        if (!title) {
            skippedCount++;
            results.push({
                status: 'skipped',
                aviso,
                message: 'Aviso incompleto: falta el título',
            });
            continue;
        }

        try {
            // Inserta el aviso en la base de datos.
            await connection.execute(insertQuery, [title, subtitle || null, link || null]);
            results.push({ status: 'success', aviso });
        } catch (error) {
            // Maneja duplicados y otros errores.
            if (error.code === 'ER_DUP_ENTRY') {
                duplicateCount++;
                results.push({ status: 'duplicate', aviso });
            } else {
                console.error(
                    'Error al guardar aviso:',
                    { title, subtitle },
                    error.message
                );
                results.push({ status: 'error', aviso, message: error.message });
            }
        }
    }

    // Resumen de resultados.
    if (duplicateCount > 0) {
        console.warn(`Avisos duplicados controlados y no almacenados: ${duplicateCount}`);
    }
    if (skippedCount > 0) {
        console.warn(`Avisos incompletos omitidos: ${skippedCount}`);
    }

    await connection.end();
    return results;
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
        const [rows] = await connection.execute('SELECT * FROM avisos');
        return rows;
    } catch (error) {
        console.error('Error al obtener los avisos:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
};

// Exporta las funciones para su uso en otros módulos.
module.exports = { saveAvisos, getAllAvisos };
