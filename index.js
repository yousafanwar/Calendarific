const axios = require('axios');
const express = require('express');
const NodeCache = require('node-cache');
const dotenv = require('dotenv');
let { api_key, baseUrl, cacheTTL } = require('./config.js');


dotenv.config();
const app = express();
const port = 3000;
const cache = new NodeCache({ stdTTL: cacheTTL });


app.get('/:country/:year', async function (req, res) {
    const {country, year} = req.params;
    try {
        const cacheKey = `${country}-${year}`;
        const cachedResponse = cache.get(cacheKey);
        if (cachedResponse) {
            console.log(`Data fetched from cache memory against key ${cacheKey}`);
            res.status(200).json(cachedResponse);
        } else {
                const response = await axios.get(`${baseUrl}holidays?api_key=${api_key}&country=${country}&year=${year}`);
                const result = response.data.response.holidays;
                if (result) {
                    const data = result.map(function (item) {
                        return {
                            "Event Name": item.name,
                            "Description": item.description,
                            "Date": item.date.iso,
                            "Holiday Type": item.type.primary_type
                        }
                    })
                    cache.set(cacheKey, data);
                    res.status(200).json(data);
                } else {
                    return res.status(404).json({error: "Data not found"});
                }
}
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;
            console.log(`Server responded with status code: ${statusCode}`);
            res.status(statusCode).json({ error: error.response.data.message });
          } else {
            console.log('No response from server');
            res.status(500).json({ error: 'Internal Server Error' });
          }
    }
})

app.get('/countries', async function (req, res) {
    try {
            const response = await axios.get(`${baseUrl}countries?api_key=${api_key}`);
            const result = response.data;
            if(result){
                res.status(200).json(result);
            }else{
                return res.status(404).json("Data not found");
            }
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;
            console.log(`Server responded with status code: ${statusCode}`);
            res.status(statusCode).json({ error: error.response.data.message });
          } else {
            console.log('No response from server');
            res.status(500).json({ error: 'Internal Server Error' });
          }
    }
})



app.listen(port, function () {
    console.log(`The app is listing on port ${port}`);
})

module.exports = app;