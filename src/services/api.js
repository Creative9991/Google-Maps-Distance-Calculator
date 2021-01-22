import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

export const getHistorydata = async () => {

    try {
        
      const response = await axios.get(
        `${REACT_APP_API_URL}/historydata`,
      );
      let distance = response.data.distance;
      return distance;
    } catch (err) {
      console.error(`Something went wrong fetching the Posts data: ${err}`);
      throw err;
    }
  };





