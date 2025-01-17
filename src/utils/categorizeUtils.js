/**
 * Categoriza un aviso según su título o subtítulo.
 *
 * @param {Object} aviso - El aviso a categorizar.
 * @param {string} aviso.title - Título del aviso.
 * @returns {string} - La categoría del aviso.
 */
const categorizeAviso = (aviso) => {
    const title = aviso.title.toLowerCase();

    if (title.includes('tráfico') || title.includes('circulación')) {
        return 'Tráfico';
    }
    if (title.includes('agua')) {
        return 'Suministros';
    }
    if (title.includes('infraestructura')) {
        return 'Infraestructuras';
    }
    return 'Sin categoría';
};

module.exports = { categorizeAviso };
