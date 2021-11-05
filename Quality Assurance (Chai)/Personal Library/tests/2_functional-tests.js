/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Book = require("../models/book.js");

chai.use(chaiHttp);

const deleteBooks = async function () {
  try {
    const docs = await Book.deleteMany({});
  }
  catch (err) {
    console.log(err);
  }
}

var invalidId = "000000000000000000000000";

describe('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  before(async function () {
    await deleteBooks();
    await chai.request(server)
      .post("/api/books")
      .send({title: "testBook1"});
  });
  it('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  describe('Routing tests', function () {


    describe('POST /api/books with title => create book object/expect book object', function () {

      it('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post("/api/books")
          .send({ title: "testBook1" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            var data = res.body;
            assert.isObject(data);
            assert.equal(data.title, "testBook1");
            assert.isNotEmpty(data._id);
            done();
          });
      });

      it('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post("/api/books")
          .send({ title: "" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            var data = res.text;
            assert.isString(data);
            assert.equal(data, "missing required field title");
            done();
          });
      });

    });


    describe('GET /api/books => array of books', function () {
      before(async function () {
        await deleteBooks();
        await chai.request(server)
          .post("/api/books")
          .send({title: "testBook1"});
        await chai.request(server)
          .post("/api/books")
          .send({title: "testBook2"});
      });
      it('Test GET /api/books', function (done) {
        chai.request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            var data = res.body;
            assert.isArray(data);
            assert.property(data[0], 'commentcount');
            assert.property(data[0], 'title');
            assert.property(data[0], '_id');
            assert.property(data[1], 'commentcount');
            assert.property(data[1], 'title');
            assert.property(data[1], '_id');
            done();
          });
      });

    });


    describe('GET /api/books/[id] => book object with [id]', function () {
      var testId;
      before(async function () {
        await deleteBooks();
        var res = await chai.request(server)
          .post("/api/books")
          .send({title: "testBook1"});
        testId = res.body._id;
      });
      it('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get("/api/books/" + invalidId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            var data = res.text;
            assert.isString(data);
            assert.equal(data, "no book exists");
            done();
          });
      });

      it('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get("/api/books/" + testId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            var data = res.body;
            assert.isObject(data);
            assert.property(data, "title");
            assert.property(data, "_id");
            assert.property(data, "comments");
            assert.isArray(data.comments);
            done();
          });
      });

    });


    describe('POST /api/books/[id] => add comment/expect book object with id', function () {
      var testId;
      before(async function () {
        await deleteBooks();
        var res = await chai.request(server)
          .post("/api/books")
          .send({title: "testBook1"});
        testId = res.body._id;
      });
      it('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post("/api/books/" + testId)
          .send({ comment: "comment1" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            var data = res.body;
            assert.isObject(data);
            assert.property(data, "title");
            assert.property(data, "_id");
            assert.property(data, "comments");
            assert.isArray(data.comments);
            assert.equal(data.comments[0], "comment1")
            done();
          });
      });

      it('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post("/api/books/" + testId)
          .send({ comment: "" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            var data = res.text;
            assert.isString(data);
            assert.equal(data, "missing required field comment");
            done();
          });
      });

      it('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post("/api/books/" + invalidId)
          .send({ comment: "comment1" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            var data = res.text;
            assert.isString(data);
            assert.equal(data, "no book exists");
            done();
          });
      });

    });

    describe('DELETE /api/books/[id] => delete book object id', function () {
      var testId;
      before(async function () {
        await deleteBooks();
        var res = await chai.request(server)
          .post("/api/books")
          .send({title: "testBook1"});
        testId = res.body._id;
      });
      it('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete("/api/books/" + testId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            var data = res.text;
            assert.isString(data);
            assert.equal(data, "delete successful");
            done();
          });
      });

      it('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete("/api/books/" + invalidId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            var data = res.text;
            assert.isString(data);
            assert.equal(data, "no book exists");
            done();
          });
      });

    });

  });

});
