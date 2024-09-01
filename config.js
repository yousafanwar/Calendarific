import dotenv from 'dotenv';

dotenv.config();

export const api_key = process.env.CALENDARIFIC_API_KEY;
export const baseUrl = process.env.Base_Url;
export const cacheTTL = process.env.CACHE_TTL