const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite("Unit Tests", function() {
  suite("Number Tests", function() {
    //#1
    test("Read a whole number input", function() {
      assert.equal(convertHandler.getNum("15gal"), 15);
    });
    //#2
    test("Read a decimal number input", function() {
      assert.equal(convertHandler.getNum("15.5km"), 15.5);
    });
    //#3
    test("Read a fractional input", function() {
      assert.equal(convertHandler.getNum("1/2lbs"), 0.5);
    });
    //#4
    test("Read a fractional input with a decimal", function() {
      assert.equal(convertHandler.getNum("1/2.5lbs"), 0.4);
    });
    //#5
    test("Return an error on a double-fraction", function() {
      assert.equal(convertHandler.getNum("3/2/3lbs"), null);
    });
    //#6
    test("Default to a numerical input of 1 when no numerical input is provided", function() {
      assert.equal(convertHandler.getNum("lbs"), 1);
    });
  });

  suite("Input Unit Tests", function() {
    //#7
    test("Correctly read each valid input unit (including Mayus)", function() {
      const inputs = ["1GAL", "2L", "3MI", "4KM", "5LBS", "6KG", "7gal", "8l", "9mi", "10km", "11lbs", "12kg"];
      const expectedResults = ["gal", "L", "mi", "km", "lbs", "kg", "gal", "L", "mi", "km", "lbs", "kg"];
      inputs.forEach((value, index) => {
        assert.equal(convertHandler.getUnit(value), expectedResults[index]);
      });
    });
    //#8
    test("Return an error for an invalid input unit", function() {
      const invalidUnit = "invalidUnit";
      assert.equal(convertHandler.getUnit(invalidUnit), null);
    });
    //#9
    test("Return the correct return unit for each valid input unit", function() {
      const inputUnits = ["gal", "L", "mi", "km", "lbs", "kg"];
      const expectedResults = ["L", "gal", "km", "mi", "kg", "lbs"];
      inputUnits.forEach((value, index) => {
        assert.equal(convertHandler.getReturnUnit(value), expectedResults[index]);
      });
    });
    //#10
    test("Return the spelled-out string unit for each valid input unit", function() {
      const inputUnits = ["gal", "L", "mi", "km", "lbs", "kg"];
      const expectedResults = ["gallons", "liters", "miles", "kilometers", "pounds", "kilograms"];
      inputUnits.forEach((value, index) => {
        assert.equal(convertHandler.spellOutUnit(value), expectedResults[index]);
      });
    });
  });

  suite("Convert Tests", function() {
    //#11
    test("Convert gal to L", function() {
      const inputNumber = 10;
      const inputUnit = "gal";
      const expectedResult = 10 * 3.78541;
      const delta = 0.01;
      assert.approximately(convertHandler.convert(inputNumber, inputUnit), expectedResult, delta);
    });
    //#12
    test("Convert L to gal", function() {
      const inputNumber = 10;
      const inputUnit = "L";
      const expectedResult = 10 / 3.78541;
      const delta = 0.01;
      assert.approximately(convertHandler.convert(inputNumber, inputUnit), expectedResult, delta);
    });
    //#13
    test("Convert mi to km", function() {
      const inputNumber = 10;
      const inputUnit = "mi";
      const expectedResult = 10 * 1.60934;
      const delta = 0.01;
      assert.approximately(convertHandler.convert(inputNumber, inputUnit), expectedResult, delta);
    });
    //#13
    test("Convert km to mi", function() {
      const inputNumber = 10;
      const inputUnit = "km";
      const expectedResult = 10 / 1.60934;
      const delta = 0.01;
      assert.approximately(convertHandler.convert(inputNumber, inputUnit), expectedResult, delta);
    });
    //#14
    test("Convert lbs to kg", function() {
      const inputNumber = 10;
      const inputUnit = "lbs";
      const expectedResult = 10 * 0.453592;
      const delta = 0.01;
      assert.approximately(convertHandler.convert(inputNumber, inputUnit), expectedResult, delta);
    });
    //#15
    test("Convert kg to lbs", function() {
      const inputNumber = 10;
      const inputUnit = "kg";
      const expectedResult = 10 / 0.453592;
      const delta = 0.01;
      assert.approximately(convertHandler.convert(inputNumber, inputUnit), expectedResult, delta);
    });


    /*test("ffc", function() {
      const data1 = await $.get(getUserInput('url') + '/api/convert?input=mi');
      assert.approximately(data1.initNum, 1, 0.001);
      assert.approximately(data1.returnNum, 1.60934, 0.001);
      assert.equal(data1.returnUnit, 'km');
      const data2 = await $.get(getUserInput('url') + '/api/convert?input=1/5mi');
      assert.approximately(data2.initNum, 1 / 5, 0.1);
      assert.approximately(data2.returnNum, 0.32187, 0.001);
      assert.equal(data2.returnUnit, 'km');
      const data3 = await $.get(
        getUserInput('url') + '/api/convert?input=1.5/7km'
      );
      assert.approximately(data3.initNum, 1.5 / 7, 0.001);
      assert.approximately(data3.returnNum, 0.13315, 0.001);
      assert.equal(data3.returnUnit, 'mi');
      const data4 = await $.get(
        getUserInput('url') + '/api/convert?input=3/2.7km'
      );
      assert.approximately(data4.initNum, 3 / 2.7, 0.001);
      assert.approximately(data4.returnNum, 0.69041, 0.001);
      assert.equal(data4.returnUnit, 'mi');
    });*/

  });

});