const axios = require('axios');

exports.handler = async function (event, context) {
  const name = event.queryStringParameters.name;

  try {
    // Querying the Open Powerlifting dataset using a proxy API service
    const response = await axios.get(
      `https://lifterapi.com/athletes?name=${encodeURIComponent(name)}`
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
