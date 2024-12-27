const axios = require("axios"); // Importa Axios para realizar solicitudes HTTP.
const cheerio = require("cheerio"); // Importa Cheerio para manipular y extraer datos del HTML.
const { formatEventDate } = require("../utils/dateUtils"); // Importa una utilidad para formatear fechas.

// Constante para almacenar la base común de las URLs del Ayuntamiento de León.
const BASE_URL = "https://www.aytoleon.es/es/actualidad";

/**
 * Realiza el scraping de una página específica y devuelve los datos procesados.
 * @param {string} url - URL completa de la página a scrapear.
 * @param {Function} processFn - Función personalizada para procesar los datos de la página.
 * @returns {Promise<Array>} Datos extraídos y procesados.
 */
const scrapePage = async (url, processFn) => {
  try {
    console.log(`Iniciando scraping de: ${url}`);
    const { data } = await axios.get(url); // Solicitud HTTP GET para obtener el HTML de la página.
    const $ = cheerio.load(data); // Carga el HTML en Cheerio.
    return processFn($); // Llama a la función personalizada para procesar los datos.
  } catch (error) {
    console.error(`Error durante el scraping de: ${url} - ${error.message}`);
    throw error;
  }
};

/**
 * Procesa la estructura HTML para extraer eventos.
 * @param {CheerioStatic} $ - Instancia de Cheerio con el HTML cargado.
 * @returns {Array} Lista de eventos extraídos.
 */
const processEvents = ($) => {
  const events = [];
  $(".row.listitem-row").each((_, element) => {
    const rawDate = $(element).find(".shortpoint-listitem-date").text().trim() || null;
    const title = $(element).find(".listitem-title").text().trim() || null;
    const subtitle = $(element).find(".listitem-subtitle").text().trim() || null;

    let event_time = null;
    let location = null;

    if (subtitle) {
      const timeMatch = subtitle.match(/^(\d{1,2}:\d{2})/);
      if (timeMatch) {
        event_time = timeMatch[1];
        location = subtitle.replace(timeMatch[0], "").trim();
      } else {
        location = subtitle.trim();
      }

      location = location.replace(/^\s*horas\s*/i, "").replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    }

    events.push({ rawDate, title, location, event_time });
  });

  return events.map(event => ({
    event_date: formatEventDate(event.rawDate),
    title: event.title,
    location: event.location,
    event_time: event.event_time,
  }));
};

/**
 * Procesa la estructura HTML para extraer avisos.
 * @param {CheerioStatic} $ - Instancia de Cheerio con el HTML cargado.
 * @returns {Array} Lista de avisos extraídos.
 */
const processAvisos = ($) => {
  const avisos = [];
  $(".row.listitem-row").each((_, element) => {
    const title = $(element).find(".listitem-title").text().trim() || null;
    const subtitle = $(element).find(".listitem-subtitle").text().trim() || null;

    const relativeLink = $(element).closest("a").attr("href") || null;
    const link = relativeLink ? new URL(relativeLink, BASE_URL).href : null;

    avisos.push({ title, subtitle, link });
  });
  return avisos;
};

/**
 * Procesa la estructura HTML para extraer noticias.
 * @param {CheerioStatic} $ - Instancia de Cheerio con el HTML cargado.
 * @returns {Array} Lista de noticias extraídas.
 */
const processNews = ($) => {
  const news = [];
  $(".listitem-row").each((_, element) => {
    const title = $(element).find(".listitem-title").text().trim() || null;
    const rawDate = $(element).find(".listitem-subtitle").first().text().trim() || null;
    const content = $(element).find(".listitem-subtitle").last().text().trim() || null;

    const relativeLink = $(element).find("a").attr("href") || null;
    const link = relativeLink ? new URL(relativeLink, BASE_URL).href : null;

    news.push({ title, rawDate, content, link });
  });
  return news;
};

/**
 * Scrapea eventos de la URL específica de eventos.
 * @returns {Promise<Array>} Lista de eventos procesados desde la sección de eventos.
 */
const scrapeEvents = () =>
  scrapePage(`${BASE_URL}/eventos/Paginas/default.aspx`, processEvents);

/**
 * Scrapea eventos de la URL específica de agenda.
 * @returns {Promise<Array>} Lista de eventos procesados desde la agenda.
 */
const scrapeAgenda = () =>
  scrapePage(`${BASE_URL}/agenda/Paginas/default.aspx`, processEvents);

/**
 * Scrapea los avisos de la URL de avisos.
 * @returns {Promise<Array>} Lista de avisos extraídos de la página.
 */
const scrapeAvisos = () =>
  scrapePage(`${BASE_URL}/avisos/Paginas/default.aspx`, processAvisos);

/**
 * Scrapea las noticias de la URL de noticias.
 * @returns {Promise<Array>} Lista de noticias extraídas de la página.
 */
const scrapeNews = () =>
  scrapePage(`${BASE_URL}/noticias/Paginas/default.aspx`, processNews);

// Exporta las funciones para su uso en otros módulos.
module.exports = { scrapeEvents, scrapeAgenda, scrapeAvisos, scrapeNews };
