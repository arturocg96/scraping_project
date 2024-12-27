const axios = require("axios"); // Importa Axios para realizar solicitudes HTTP.
const cheerio = require("cheerio"); // Importa Cheerio para manipular y extraer datos del HTML.
const { formatEventDate } = require("../utils/dateUtils"); // Función personalizada para formatear fechas.

/**
 * Scrapea eventos de la URL específica de eventos.
 * @returns {Promise<Array>} Lista de eventos procesados desde la sección de eventos.
 */
const scrapeEvents = async () => {
  const url = "https://www.aytoleon.es/es/actualidad/eventos/Paginas/default.aspx";
  return scrapePage(url, "eventos");
};

/**
 * Scrapea eventos de la URL específica de agenda.
 * @returns {Promise<Array>} Lista de eventos procesados desde la agenda.
 */
const scrapeAgenda = async () => {
  const url = "https://www.aytoleon.es/es/actualidad/agenda/Paginas/default.aspx";
  return scrapePage(url, "agenda");
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
    
    const { data } = await axios.get(url); // Realiza la solicitud GET y extrae el HTML.
    const $ = cheerio.load(data); // Carga el HTML en Cheerio para procesarlo.

    const events = []; // Array para almacenar los eventos extraídos.

    // Selecciona y procesa cada elemento relevante de la página.
    $(".row.listitem-row").each((_, element) => {
      const rawDate = $(element).find(".shortpoint-listitem-date").text().trim() || null;
      const title = $(element).find(".listitem-title").text().trim() || null;
      const subtitle = $(element).find(".listitem-subtitle").text().trim() || null;

      let event_time = null;
      let location = null;

      // Extrae la hora y ubicación del subtítulo si está presente.
      if (subtitle) {
        const timeMatch = subtitle.match(/^(\d{1,2}:\d{2})/);
        if (timeMatch) {
          event_time = timeMatch[1];
          location = subtitle.replace(timeMatch[0], "").trim();
        } else {
          location = subtitle.trim();
        }

        // Limpia la ubicación eliminando patrones innecesarios.
        location = location.replace(/^\s*horas\s*/i, "").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
      }

      // Agrega el evento con los datos recopilados al array.
      events.push({ rawDate, title, location, event_time });
    });

    console.log(`Scraping de ${type} completado: ${events.length} eventos encontrados`);

    // Devuelve los eventos con las fechas formateadas y estructuradas.
    return events.map(event => ({
      event_date: formatEventDate(event.rawDate),
      title: event.title,
      location: event.location,
      event_time: event.event_time,
    }));
  } catch (error) {
    console.error(`Error durante el scraping de ${type}: ${error.message}`);
    throw error;
  }
};

/**
 * Scrapea los avisos de la URL de avisos.
 * @returns {Promise<Array>} Lista de avisos extraídos de la página.
 */
const scrapeAvisos = async () => {
  const url = "https://www.aytoleon.es/es/actualidad/avisos/Paginas/default.aspx";

  try {
    console.log(`Iniciando scraping de avisos: ${url}`);

    const { data } = await axios.get(url); // Realiza la solicitud GET y extrae el HTML.
    const $ = cheerio.load(data); // Carga el HTML en Cheerio.

    const avisos = []; // Array para almacenar los avisos extraídos.

    // Procesa cada elemento relevante en la página.
    $(".row.listitem-row").each((_, element) => {
      const title = $(element).find(".listitem-title").text().trim() || null;
      const subtitle = $(element).find(".listitem-subtitle").text().trim() || null;

      // Extrae el enlace relativo y lo convierte en absoluto.
      const relativeLink = $(element).closest("a").attr("href") || null;
      const link = relativeLink ? new URL(relativeLink, url).href : null;

      avisos.push({ title, subtitle, link });
    });

    console.log(`Scraping completado: ${avisos.length} avisos encontrados`);
    return avisos;
  } catch (error) {
    console.error(`Error durante el scraping de avisos: ${error.message}`);
    throw error;
  }
};

// Exporta las funciones para su uso en otros módulos.
module.exports = { scrapeEvents, scrapeAgenda, scrapeAvisos };
