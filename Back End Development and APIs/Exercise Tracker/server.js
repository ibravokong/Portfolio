const express = require('express')
const mongoose = require("mongoose");
const app = express()
const bodyParser = require("body-parser");
const cors = require('cors')
require('dotenv').config()

const userRouter =  require("./routes/user-routes.js");
const errorController = require("./controllers/error-controllers.js");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

/*app.use((req, res, next) => {
  console.log(`LOG: ${req.method} ${req.path}`);
   if (req.method === 'POST') {
     console.log('  body:', req.body);
   } else {
     console.log(' params:', req.params);
   }
  next();
});*/

app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.sendFile("/views/index.html", {root : __dirname});
});

app.use(errorController);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});