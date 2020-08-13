const express = require('express');
const hbs = require('hbs');
const path = require('path');
const app = express();
const port = 3000;
const axios = require('axios');
const request = require('request');

// Finding a public directory
const publicDirectory = path.join(__dirname, '/public');
// Setting express to use the static files from public directory
app.use(express.static(publicDirectory));

const viewsPath = path.join(__dirname, '/views');
const partialPath = path.join(__dirname, '/views/partials');

hbs.registerPartials(partialPath);

// setting node.js view engine to use handlebars files
app.set('view engine', 'hbs');
//setting the views from HBS to come from our views path variable
app.set('views', viewsPath);
app.use(express.static('views/images'));

// Parse URL- encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const timeStampCoverter = (timestamp) => {
  let date = new Date(timestamp * 1000);
  let hrs = date.getHours();
  let mins = '0' + date.getMinutes();
  let formattedTime = hrs + ':' + mins.substr(-2) + ':';
  return formattedTime;
};

app.get('/', (req, res) => {
  res.render('');
});

app.post('/result', async (req, res) => {
  try {
    const city = req.body.city;
    const country = req.body.country;
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=b7e53a69e8d57ee9c4e219dc0de83c6d`;
    const apiResponse = await axios.get(weatherURL);
    let iconCode = apiResponse.data.weather[0].icon;
    iconUrl = 'http://openweathermap.org/img/w/' + iconCode + '.png';

    if (country.length > 3) {
      res.send(
        'Please enter country code such as UK for united Kingdom or DE for Germany'
      );
    }

    res.render('index', {
      weather: apiResponse.data.main.temp,
      cityName: city,
      info: apiResponse.data.weather[0].description,
      iconPic: iconUrl,
    });
  } catch (e) {
    console.log('error');
  }
});

app.get('/krakow', async (req, res) => {
  try {
    const krakowImage =
      'https://images.fineartamerica.com/images/artworkimages/mediumlarge/2/krakow-cityscape-travel-poster-inspirowl-design.jpg';
    weatherURLKrk =
      'https://api.openweathermap.org/data/2.5/onecall?lat=50.0647&lon=19.9450&exclude=hourly&units=metric&appid=b7e53a69e8d57ee9c4e219dc0de83c6d';
    apiResponseKrk = await axios.get(weatherURLKrk);
    let krkIconCode = apiResponseKrk.data.current.weather[0].icon;
    let iconUrl1 = 'http://openweathermap.org/img/w/' + krkIconCode + '.png';
    let timestampSunrise = apiResponseKrk.data.current.sunrise;
    let timestampSunset = apiResponseKrk.data.current.sunset;
    let sunrise = timeStampCoverter(timestampSunrise);
    let sunset = timeStampCoverter(timestampSunset);

    res.render('krakow', {
      imgKrakow: krakowImage,
      krkTemp: apiResponseKrk.data.current.temp,
      krkIconPic: iconUrl1,
      krkInfo: apiResponseKrk.data.current.weather[0].description,
      krkSunrise: sunrise,
      krkSunset: sunset,
    });
  } catch (e) {
    console.log(e);
  }
});

// app.post('/krakow', (req, res) => {
//   res.render('krakow');
// });

app.get('*', (req, res) => {
  res.render('error');
});

app.listen(port, () => console.log(`Example app listening on port port!`));
