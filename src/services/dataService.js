import axios from 'axios';

const DATA_URL = 'https://data.openpowerlifting.org/lifters.json';

export const fetchData = async () => {
  try {
    const response = await axios.get(DATA_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
