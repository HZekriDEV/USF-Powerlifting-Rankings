const axios = require('axios');

exports.handler = async function (event, context) {
  const name = event.queryStringParameters.name;

  try {
    // Replace with the actual API endpoint or logic to fetch data
    const response = await axios.get(
      `https://api.openpowerlifting.org/athletes?name=${encodeURIComponent(name)}`
    );
    const data = response.data;

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching athlete data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching athlete data' }),
    };
  }
};
