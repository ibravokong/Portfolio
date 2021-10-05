require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const autoIncrement = require('mongoose-sequence')(mongoose);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false }));

const URLSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  }
});
URLSchema.plugin(autoIncrement, {inc_field: "short_url"});
let ShortURL = mongoose.model('ShortURL', URLSchema);

const saveURL = async (originalURL, res) => {
  const newURL = new ShortURL({ original_url: originalURL});
  try {
    var savedURL = await newURL.save();
    res.json({"original_url": savedURL["original_url"],
              "short_url": savedURL["short_url"]});
  }
  catch(err) {
    return console.error(err);
  }
};

const getURL = async (shortURL, res) => {
  try {
    var data = await ShortURL.findOne({ "short_url": shortURL });
    if(data != null) {
      res.redirect(data.original_url);
    }
    else {
      res.send("Short URL not found");
    }
  }
  catch(err) {
    return console.error(err);
  }
};

const returnInvalidURL = (res) => {
  res.json({ "error": "invalid url" });
};

const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/shorturl", function(req, res) {
  res.redirect("/");
});

app.get("/api/shorturl/:shorturl", function(req, res) {
  getURL(req.params.shorturl, res);
});

app.post("/api/shorturl", function(req, res) {
  try {
    var originalURL = new URL(req.body.url);
    if(["http:", "https:"].includes(originalURL.protocol)) {
      saveURL(req.body.url, res);
    }
    else {
      returnInvalidURL(res);
    }
  }
  catch(err) {
    if(err.code === "ERR_INVALID_URL") {
      returnInvalidURL(res);
    }
    else {
      return console.error(err);
    }
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
