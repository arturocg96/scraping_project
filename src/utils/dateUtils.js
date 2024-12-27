const dayjs = require('dayjs'); // Biblioteca para manipulación de fechas
require('dayjs/locale/es'); // Carga la localización para español

dayjs.locale('es'); // Configura español como idioma predeterminado

/**
 * Convierte una fecha abreviada en español al formato extendido.
 * @param {string} rawDate - La fecha en formato abreviado (e.g., "12 ene.").
 * @returns {string|null} - La fecha formateada en estilo extendido o `null` si la entrada no es válida.
 */
const formatEventDate = (rawDate) => {
    // Si no se proporciona una fecha, retorna `null`.
    if (!rawDate) return null;

    // Limpia saltos de línea y espacios adicionales de la entrada.
    const cleanDate = rawDate.replace(/\n/g, '').trim();

    // Extrae el día y el mes abreviado mediante una expresión regular.
    const dateParts = cleanDate.match(/^(\d{1,2})\s+([A-Z]{3})\.?$/);

    // Si el formato de la fecha no coincide con la expresión regular, retorna `null`.
    if (!dateParts) return null;

    const day = dateParts[1]; // Día extraído de la fecha.
    const monthShort = dateParts[2].toLowerCase(); // Mes abreviado en minúsculas.

    // Diccionario para mapear los meses abreviados en español a números.
    const months = {
        ene: '01',
        feb: '02',
        mar: '03',
        abr: '04',
        may: '05',
        jun: '06',
        jul: '07',
        ago: '08',
        sep: '09',
        oct: '10',
        nov: '11',
        dic: '12',
    };

    // Obtiene el número del mes correspondiente al mes abreviado.
    const monthNumber = months[monthShort];
    
    // Si el mes abreviado no se encuentra en el diccionario, retorna `null`.
    if (!monthNumber) return null;

    // Obtiene el año actual para construir la fecha completa.
    const currentYear = dayjs().year();

    // Construye la fecha completa en formato "D de MMMM de YYYY".
    return dayjs(`${currentYear}-${monthNumber}-${day.padStart(2, '0')}`).format('D [de] MMMM [de] YYYY');
};

module.exports = { formatEventDate }; // Exporta la función para su uso en otros módulos.
