const axios = require('axios');
const cheerio = require('cheerio');

const OPENPOWERLIFTING_URL = 'https://www.openpowerlifting.org';

const getAthletes = async () => {
  try {
    const { data } = await axios.get(OPENPOWERLIFTING_URL);
    const $ = cheerio.load(data);
    
    let athletes = [];
    // Example parsing, adapt based on actual HTML structure
    $('.athlete-row').each((index, element) => {
      const name = $(element).find('.athlete-name').text();
      const weightClass = $(element).find('.weight-class').text();
      const total = $(element).find('.total').text();
      const strengthMetric = $(element).find('.metric').text();

      athletes.push({ id: index, name, weightClass, total, strengthMetric });
    });

    return athletes;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

module.exports = { getAthletes };