const axios = require('axios'); // Importa Axios para realizar solicitudes HTTP.
const cheerio = require('cheerio'); // Importa Cheerio para manipular y extraer datos del HTML.
const { formatEventDate } = require('../utils/dateUtils'); // Función personalizada para formatear fechas.

/**
 * Scrapea eventos de la URL específica de eventos.
 * @returns {Promise<Array>} Lista de eventos procesados desde la sección de eventos.
 */
const scrapeEvents = async () => {
    const url = 'https://www.aytoleon.es/es/actualidad/eventos/Paginas/default.aspx';
    return await scrapePage(url, 'eventos');
};

/**
 * Scrapea eventos de la URL específica de agenda.
 * @returns {Promise<Array>} Lista de eventos procesados desde la agenda.
 */
const scrapeAgenda = async () => {
    const url = 'https://www.aytoleon.es/es/actualidad/agenda/Paginas/default.aspx';
    return await scrapePage(url, 'agenda');
};

/**
 * Realiza el scraping de una página específica y devuelve una lista de eventos procesados.
 * @param {string} url - URL de la página a scrapear.
 * @param {string} type - Tipo de scraping (por ejemplo, 'eventos' o 'agenda').
 * @returns {Promise<Array>} Lista de eventos extraídos y formateados.
 */
const scrapePage = async (url, type) => {
    try {
        console.log(`Iniciando scraping de ${type}: ${url}`);
        
        // Realiza una solicitud GET a la URL
        const response = await axios.get(url);
        const $ = cheerio.load(response.data); // Carga el HTML recibido en Cheerio

        const events = [];

        // Selecciona y procesa cada elemento relevante de la página
        $('.row.listitem-row').each((_, element) => {
            const rawDate = $(element).find('.shortpoint-listitem-date').text().trim() || null;
            const title = $(element).find('.listitem-title').text().trim() || null;
            const subtitle = $(element).find('.listitem-subtitle').text().trim() || null;

            let event_time = null;
            let location = null;

            if (subtitle) {
                // Extrae la hora del subtítulo si está presente
                const timeMatch = subtitle.match(/^(\d{1,2}:\d{2})/);
                if (timeMatch) {
                    event_time = timeMatch[1];
                    location = subtitle.replace(timeMatch[0], '').trim();
                } else {
                    location = subtitle.trim();
                }

                // Limpia el texto de la ubicación eliminando patrones innecesarios
                location = location.replace(/^\s*horas\s*/i, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
            }

            // Añade el evento a la lista con los datos recopilados
            events.push({
                rawDate,
                title,
                location,
                event_time,
            });
        });

        console.log(`Scraping de ${type} completado: ${events.length} eventos encontrados`);

        // Devuelve los eventos con fechas formateadas y datos estructurados
        return events.map(event => ({
            event_date: formatEventDate(event.rawDate), // Convierte la fecha al formato necesario
            title: event.title,
            location: event.location,
            event_time: event.event_time,
        }));
    } catch (error) {
        console.error(`Error durante el scraping de ${type}: ${error.message}`);
        throw error;
    }
};

// Exporta las funciones para su uso en otros módulos
module.exports = { scrapeEvents, scrapeAgenda };
