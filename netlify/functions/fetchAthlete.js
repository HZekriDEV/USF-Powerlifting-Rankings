const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async function (event, context) {
  const athleteName = event.queryStringParameters.name;

  // Example OpenPowerlifting search URL structure; you'll need to know the athlete's name or ID
  const url = `https://www.openpowerlifting.org/u/${athleteName}`;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Example: scrape athlete's name, total, DOTS, GL Points from the page
    const athlete = {
      name: $('h1').text(), // Extract athlete's name from the header
      total: $('span:contains("Total")').next().text(), // Example way of scraping the 'Total' value
      dots: $('span:contains("DOTS")').next().text(),  // Scrape DOTS score
      weightClass: $('span:contains("Weight Class")').next().text(),  // Scrape Weight Class
      // Add other relevant information by analyzing the structure of the HTML
    };

    return {
      statusCode: 200,
      body: JSON.stringify(athlete),
    };
  } catch (error) {
    console.error('Error scraping athlete data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error scraping athlete data' }),
    };
  }
};
