const math = require("mathjs");

function ConvertHandler() {
  
  this.galToL = 3.78541;
  this.lbsToKg = 0.453592;
  this.miToKm = 1.60934;

  this.getNum = function(input) {
    let result;
    let charIndex = input.search(/[a-zA-z]/);
    result = input.slice(0, charIndex);

    if((result.match(/\//g) || []).length > 1) return null;
    if(result.length == 0) result = 1;

    return math.evaluate(result);
  };
  
  this.getUnit = function(input) {
    let charIndex = input.search(/[a-zA-z]/);
    let result = input.slice(charIndex).toLowerCase();
    
    if(result === "l") result = "L";
    if(!["gal", "L", "mi", "km", "lbs", "kg"].includes(result)) return null;
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    switch(initUnit) {
      case "gal":
        return "L";
      case "L":
        return "gal";
      case "mi":
        return "km";
      case "km":
        return "mi";
      case "lbs":
        return "kg";
      case "kg":
        return "lbs";
      default:
        return "invalid unit";
    };
  };

  this.spellOutUnit = function(unit) {
    switch(unit) {
      case "gal":
        return "gallons";
      case "L":
        return "liters";
      case "mi":
        return "miles";
      case "km":
        return "kilometers";
      case "lbs":
        return "pounds";
      case "kg":
        return "kilograms";
      default:
        return "invalid unit";
    };
  };
  
  this.convert = function(initNum, initUnit) {
    switch(initUnit) {
      case "gal":
        return (initNum*this.galToL);
      case "L":
        return (initNum/this.galToL);
      case "mi":
        return (initNum*this.miToKm);
      case "km":
        return (initNum/this.miToKm);
      case "lbs":
        return (initNum*this.lbsToKg);
      case "kg":
        return (initNum/this.lbsToKg);
      default:
        return -1;
    };
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
  
}

module.exports = ConvertHandler;
