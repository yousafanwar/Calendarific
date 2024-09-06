const dotenv = require('dotenv');

dotenv.config();

const api_key = process.env.CALENDARIFIC_API_KEY;
const baseUrl = process.env.Base_Url;
const cacheTTL = process.env.CACHE_TTL


module.exports = {
    api_key,
    baseUrl,
    cacheTTL
  };