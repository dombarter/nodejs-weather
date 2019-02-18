
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

const apiKey = 'd77c7178802b17c10c0e43ba9359b06e';

app.use(express.static('./public'));
app.use(express.static('./views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

function celcius(temp){
  var new_temp = (temp - 32) * (5 / 9);
  return Math.round(new_temp);
}

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null, location: null});
})

app.get('/test', function (req, res) {
  res.end("Hello World!");
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again', location: null});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again', location: null});
      } else {
        let locationInfo = `https://maps.google.com/maps?q=${weather.coord.lat},${weather.coord.lon}&output=embed&z=13`;
        let weatherText = `It's ${celcius(weather.main.temp)}°C in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null , location: locationInfo});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('App Running')
})
