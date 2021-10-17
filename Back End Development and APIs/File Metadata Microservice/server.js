var express = require('express');
var cors = require('cors');
require('dotenv').config()
var app = express();

const fileAnalyseRouter =  require("./routes/fileAnalyse-routes.js");
const errorController =  require("./controllers/error-controllers.js");

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.use("/api/fileanalyse", fileAnalyseRouter);

app.get("/", (req, res) => {
  res.sendFile("/views/index.html", {root : __dirname});
});

app.use(errorController);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
