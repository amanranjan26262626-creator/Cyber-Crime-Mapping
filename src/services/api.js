import axios from 'axios';

const API_TOKEN = '14676813173:app:siWbMMzB';
const API_URL = '/api/';

export const searchLeakOsint = async (query) => {
    try {
        const response = await axios.post(API_URL, {
            token: API_TOKEN,
            request: query,
            limit: 100,
            lang: 'en'
        });

        if (response.data && response.data.List) {
            return response.data;
        } else {
            console.error("API Error or No Data:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Search failed:", error);
        return null;
    }
};
