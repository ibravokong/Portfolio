var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

console.log("Hello World");
app.use(function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});
app.use("/public", express.static(__dirname + "/public"));
app.get("/", function(req, res) {
  absolutePath = __dirname + "/views/index.html";
  res.sendFile(absolutePath);
});
app.get("/json", function(req, res) {
  var responseObj = {"message": "Hello json"};
  if(process.env.MESSAGE_STYLE == "uppercase") {
    responseObj.message = responseObj.message.toUpperCase();
  }
  res.json(responseObj);
});
app.get("/now", function(req, res, next) {
  req.time = new Date().toString();
  next();
}, function(req, res) {
  res.json({time: req.time});
});
app.get("/:word/echo", function(req, res) {
  res.json({echo: req.params.word});
})
app.route("/name").post(function(req, res) {
  res.json({name: req.body.first + " " + req.body.last})
});

































 module.exports = app;
