const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  //#1
  test("Test valid input", function(done) {
    chai
      .request(server)
      .get("/api/convert?input=10L")
      .end(function (err, res) {
        const expectedResult = [10, "L", 2.64172, "gal", "10 liters converts to 2.64172 gallons"];
        const delta = 0.01;
        assert.equal(res.status, 200);
        assert.equal(res.body.initNum, expectedResult[0]);
        assert.equal(res.body.initUnit, expectedResult[1]);
        assert.approximately(res.body.returnNum, expectedResult[2], delta);
        assert.equal(res.body.returnUnit, expectedResult[3]);
        assert.equal(res.body.string, expectedResult[4]);
        done();
      });
  });
  //#2
  test("Test invalid unit", function(done) {
    chai
      .request(server)
      .get("/api/convert?input=32g")
      .end(function (err, res) {
        const expectedResult = "invalid unit";
        const delta = 0.01;
        assert.equal(res.status, 200);
        assert.equal(res.text, expectedResult);
        done();
      });
  });
  //#3
  test("Test invalid number", function(done) {
    chai
      .request(server)
      .get("/api/convert?input=3/7.2/4kg")
      .end(function (err, res) {
        const expectedResult = "invalid number";
        const delta = 0.01;
        assert.equal(res.status, 200);
        assert.equal(res.text, expectedResult);
        done();
      });
  });
  //#4
  test("Test invalid unit and number", function(done) {
    chai
      .request(server)
      .get("/api/convert?input=3/7.2/4kilomegagram")
      .end(function (err, res) {
        const expectedResult = "invalid number and unit";
        const delta = 0.01;
        assert.equal(res.status, 200);
        assert.equal(res.text, expectedResult);
        done();
      });
  });
  //#5
  test("Test with no number", function(done) {
    chai
      .request(server)
      .get("/api/convert?input=kg")
      .end(function (err, res) {
        const expectedResult = [1, "kg", 2.20462, "lbs", "1 kilograms converts to 2.20462 pounds"];
        const delta = 0.01;
        assert.equal(res.status, 200);
        assert.equal(res.body.initNum, expectedResult[0]);
        assert.equal(res.body.initUnit, expectedResult[1]);
        assert.approximately(res.body.returnNum, expectedResult[2], delta);
        assert.equal(res.body.returnUnit, expectedResult[3]);
        assert.equal(res.body.string, expectedResult[4]);
        done();
      });
  });
});
