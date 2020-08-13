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
  let formattedTime = hrs + ':' + mins.substr(-2);
  return formattedTime;
};

const dPlusMTimestampConverter = (timestamp) => {
  let date = new Date(timestamp * 1000);
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let day = date.getDate();
  let month = months[date.getMonth()];
  let formattedDate = day + ' ' + month;
  return formattedDate;
};

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
    const daily = apiResponseKrk.data.daily;
    const dailyTemp = daily.map((e) => e.temp);
    let dailyDayDate = daily.map((e) => e.dt);
    let dailyDayTemp = dailyTemp.map((e) => e.day);
    console.log(dailyDayDate[2]);

    res.render('krakow', {
      imgKrakow: krakowImage,
      krkTemp: apiResponseKrk.data.current.temp,
      krkIconPic: iconUrl1,
      krkInfo: apiResponseKrk.data.current.weather[0].description,
      krkSunrise: sunrise,
      krkSunset: sunset,
      dailyT: dailyDayTemp,
      datePlus2: dPlusMTimestampConverter(dailyDayDate[2]),
      datePlus3: dPlusMTimestampConverter(dailyDayDate[3]),
      datePlus4: dPlusMTimestampConverter(dailyDayDate[4]),
      datePlus5: dPlusMTimestampConverter(dailyDayDate[5]),
      datePlus6: dPlusMTimestampConverter(dailyDayDate[6]),
      datePlus7: dPlusMTimestampConverter(dailyDayDate[7]),
      krkTmrw: Math.round(dailyDayTemp[0]),
      krkPlus2: Math.round(dailyDayTemp[1]),
      krkPlus3: Math.round(dailyDayTemp[2]),
      krkPlus4: Math.round(dailyDayTemp[3]),
      krkPlus5: Math.round(dailyDayTemp[4]),
      krkPlus6: Math.round(dailyDayTemp[5]),
      krkPlus7: Math.round(dailyDayTemp[6]),
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
