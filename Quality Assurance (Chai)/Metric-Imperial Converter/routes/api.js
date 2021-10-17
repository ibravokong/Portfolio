'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();
  
  app.route('/api/convert')
    .get(function (req, res) {
      try {
        var input = req.query.input;
        var initNum = convertHandler.getNum(input);
        var initUnit = convertHandler.getUnit(input);
        if(initNum == null && initUnit == null) {
          res.send("invalid number and unit");
        }
        else if(initUnit == null) {
          res.send("invalid unit");
        }
        else if(initNum == null) {
          res.send("invalid number");
        }
        else {
          var returnNum = convertHandler.convert(initNum, initUnit).toFixed(5);
          var returnUnit = convertHandler.getReturnUnit(initUnit);
          var returnString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

          res.json({"initNum": initNum,
                    "initUnit": initUnit,
                    "returnNum": Number(returnNum),
                    "returnUnit": returnUnit,
                    "string": returnString });
        } 
      }
      catch(err) {
        console.log(err);
      }
    });
};
