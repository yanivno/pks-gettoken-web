const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

//ignore tls errors
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const opsman = "https://opsman-01a.corp.local:8443/oauth/token"

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let username = req.body.username;
  let password = encodeURIComponent(req.body.password);
  //console.log(password);
  let params = `client_id=pks_cluster_client&client_secret=&grant_type=password&username=${username}&password=${password}&response_type=id_token`
  let url = opsman + "?" + params;
  console.log(url);

  var options = {
    method : "POST",
    url: url,
    headers: {
        "Accept":"application/json",
        "Content-Type" : "x-www-form-urlencoded"
      }
  };

  request(options, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body);
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('app listening on port 3000!')
})
