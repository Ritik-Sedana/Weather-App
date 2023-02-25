const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const getWeather = async (location) => {
  let weather = '';
  var config = {
    method: 'get',
    url: `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.API_KEY}`,
    headers: {},
  };

  return axios(config)
    .then(function (response) {
      weather = response.data;
      const app = replaceVal(homePage, weather);
      return app;
    })
    .catch(function (error) {
      throw error;
    });
};
const homePage = fs.readFileSync('./src/home.html', 'utf-8');
const cssFile = fs.readFileSync('./src/weather.css', 'utf-8');
const replaceVal = (tempVal, orgVal) => {
  const temperature = tempVal;
  return temperature
    .replace('{%tempval%}', orgVal.main.temp)
    .replace('{%tempmin%}', orgVal.main.temp_min)
    .replace('{%tempmax%}', orgVal.main.temp_max)
    .replace('{%location%}', orgVal.name)
    .replace('{%country%}', orgVal.sys.country)
    .replace('{%tempstatus%}', orgVal.weather[0].main);
};
app.get('/', async (req, res) => {
  const app = await getWeather('london');
  res.send(`<style>${cssFile}</style>${app}`);
});
app.get('/submit', async (req, res) => {
  try {
    const app = await getWeather(req.query.search);
    res.send(`<style>${cssFile}</style>${app}`);
  } catch (error) {}
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
