import axios from "axios";
import express from "express";
import NodeCache from 'node-cache';
import dotenv from 'dotenv';
import {api_key, baseUrl, cacheTTL} from './config.js';

dotenv.config(); 
const app = express();
const port = 3000;
const country = 'SA';
const year = 2036;
const cache = new NodeCache({ stdTTL: cacheTTL });


app.get('/', async function(req, res){
    try{ 
        const cacheKey = `${country}-${year}`;
        const cachedResponse = cache.get(cacheKey);
        if(cachedResponse){
            console.log(`Data fetched from cache memory against key ${cacheKey}`);
            res.status(200).json(cachedResponse);    
        }else{
            const response = await axios.get(`${baseUrl}holidays?api_key=${api_key}&country=${country}&year=${year}`);
            const result = response.data.response.holidays;
            const data = result ? result.map(function(item){
                return {
                        "Event Name": item.name,
                        "Description": item.description,
                        "Date": item.date.iso,
                        "Holiday Type": item.type.primary_type
                    }
            }) : "Data not found"; 
            
            cache.set(cacheKey, data);
            res.status(200).json(data);
        }
    }catch(error){
        console.log(error);
    }
})

app.get('/countries', async function(req, res){
    try{
        const response = await axios.get(`${baseUrl}countries?api_key=${api_key}`);
        const result = response.data;
        res.status(200).json(result);
    }catch(error){
        res.sendStatus(401).send(error);
    }
})



app.listen(port, function(){
    console.log(`The app is listing on port ${port}`);
})