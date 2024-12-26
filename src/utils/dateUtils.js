const dayjs = require('dayjs');
require('dayjs/locale/es');

dayjs.locale('es');

const formatEventDate = (rawDate) => {
    if (!rawDate) return null;

    const cleanDate = rawDate.replace(/\n/g, '').trim();
    const dateParts = cleanDate.match(/^(\d{1,2})\s+([A-Z]{3})\.?$/);

    if (!dateParts) return null;

    const day = dateParts[1];
    const monthShort = dateParts[2].toLowerCase();

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

    const monthNumber = months[monthShort];
    if (!monthNumber) return null;

    const currentYear = dayjs().year();
    return dayjs(`${currentYear}-${monthNumber}-${day.padStart(2, '0')}`).format('D [de] MMMM [de] YYYY');
};

module.exports = { formatEventDate };
