const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

exports.handler = async function (event, context) {
  const name = event.queryStringParameters.name.toLowerCase();
  const results = [];

  try {
    const csvFilePath = path.join(__dirname, 'data.csv');
    const data = await new Promise((resolve, reject) => {
      const athletes = [];

      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          if (row.Name && row.Name.toLowerCase().includes(name)) {
            athletes.push(row);
          }
        })
        .on('end', () => {
          resolve(athletes);
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error reading CSV file' }),
    };
  }
};
