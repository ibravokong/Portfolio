// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Timestamp Microservice
function formatDate(date) {
  var dateElements = date.toString().split(" ")
  var dateString = dateElements[0] + ", " + dateElements[2] + " " + dateElements[1] + " " + dateElements[3] + " " + dateElements[4] + " GMT";

  return dateString;
}

function getJSONDate(date) {
  var dateUnix = date.getTime();
  var dateUTC = formatDate(date);

  return {unix: dateUnix, utc: dateUTC};
}

app.get("/api/:date?", function (req, res) {
  if(req.params.date === undefined) {
    res.json(getJSONDate(new Date()));
  }
  else {
    var usedDate = new Date(req.params.date);
    if(usedDate.getTime() === usedDate.getTime()) {
      res.json(getJSONDate(usedDate));
    }
    else {
      usedDate = new Date(parseInt(req.params.date));
      if(usedDate.getTime() === usedDate.getTime()) {
        res.json(getJSONDate(usedDate));
      }
      else {
        res.json({error : "Invalid Date"});
      }
    }
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
