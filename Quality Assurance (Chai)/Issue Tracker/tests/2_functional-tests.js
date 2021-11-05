const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const Issue = require("../model/issue.js");

chai.use(chaiHttp);

const deleteTestIssues = async function() {
  try {
    const docs = await Issue.deleteMany({ project_name: "apitest" });
  }
  catch (err) {
    console.log(err);
  }
}

var testData = [{
  issue_title: "issue title 1",
  issue_text: "issue text 1",
  created_by: "A",
  assigned_to: "assigned to 1",
  status_text: "STATUS"
},
{
  issue_title: "issue title 2",
  issue_text: "issue text 2",
  created_by: "A",
  assigned_to: "assigned to 2",
  status_text: "WOHO"
},
{
  issue_title: "issue title 3",
  issue_text: "issue text 3",
  created_by: "B",
  assigned_to: "assigned to 3",
  status_text: "WOHO"
}];

deleteTestIssues();

describe("Tests", function() {
  describe("POST Tests", function() {
    // #1
    it("Create an issue with every field", function(done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "issue title 1",
          issue_text: "issue text 1",
          created_by: "creator 1",
          assigned_to: "assigned to 1",
          status_text: "status text 1"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.issue_title, "issue title 1");
          assert.equal(data.issue_text, "issue text 1");
          assert.equal(data.created_by, "creator 1");
          assert.equal(data.assigned_to, "assigned to 1");
          assert.equal(data.status_text, "status text 1");
          assert.isTrue(data.open);
          assert.isNumber(Date.parse(data.created_on));
          assert.isNumber(Date.parse(data.updated_on));
          assert.isNotEmpty(data._id);
          done();
        });
    });
    // #2
    it("Create an issue with only required fields", function(done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "issue title 2",
          issue_text: "issue text 2",
          created_by: "creator 1",
          assigned_to: "",
          status_text: ""
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.issue_title, "issue title 2");
          assert.equal(data.issue_text, "issue text 2");
          assert.equal(data.created_by, "creator 1");
          assert.isEmpty(data.assigned_to);
          assert.isEmpty(data.status_text);
          assert.isTrue(data.open);
          assert.isNumber(Date.parse(data.created_on));
          assert.isNumber(Date.parse(data.updated_on));
          assert.isNotEmpty(data._id);
          done();
        });
    });
    // #3
    it("Create an issue with missing required fields", function(done) {
      chai
        .request(server)
        .post("/api/issues/apitest")
        .send({
          issue_title: "issue title 3",
          issue_text: "issue text 3",
          created_by: ""
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.property(data, "error");
          assert.equal(data.error, "required field(s) missing");
          done();
        });
    });
  });

  describe("GET Tests", function() {
    before(async function() {
      await deleteTestIssues();
      await chai
        .request(server)
        .post("/api/issues/apitest")
        .send(testData[0]);
      await chai
        .request(server)
        .post("/api/issues/apitest")
        .send(testData[1]);
      await chai
        .request(server)
        .post("/api/issues/apitest")
        .send(testData[2]);
    });
    // #4
    it("View issues on a project", function(done) {
      chai
        .request(server)
        .get("/api/issues/apitest")
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.length, 3);
          assert.equal(data[0].issue_title, testData[0].issue_title);
          assert.equal(data[0].issue_text, testData[0].issue_text);
          assert.equal(data[0].created_by, testData[0].created_by);
          assert.equal(data[0].assigned_to, testData[0].assigned_to);
          assert.equal(data[0].status_text, testData[0].status_text);
          assert.isTrue(data[0].open);
          assert.isNumber(Date.parse(data.created_on));
          assert.isNumber(Date.parse(data.updated_on));
          assert.isNotEmpty(data[0]._id);
          done();
        });
    });
    // #5
    it("View issues on a project with one filter", function(done) {
      chai
        .request(server)
        .get("/api/issues/apitest?created_by=A")
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.length, 2);
          done();
        });
    });
    // #6
    it("View issues on a project with multiple filters", function(done) {
      chai
        .request(server)
        .get("/api/issues/apitest?created_by=A&status_text=WOHO")
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.length, 1);
          done();
        });
    });
  });

  describe("PUT Tests", function() {
    var issueId;
    before(async function() {
      await deleteTestIssues();
      var res = await chai
        .request(server)
        .post("/api/issues/apitest")
        .send(testData[0]);
      issueId = res.body._id;
    });
    // #7
    it("Update one field on an issue", function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: issueId,
          issue_title: "New Title"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.result, "successfully updated");
          assert.equal(data._id, issueId);
          done();
        });
    });
    // #8
    it("Update multiple fields on an issue", function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: issueId,
          issue_text: "New Text",
          assigned_to: "New Assigned"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.result, "successfully updated");
          assert.equal(data._id, issueId);
          done();
        });
    });
    // #9
    it("Update an issue with missing _id", function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "",
          issue_text: "New Text",
          assigned_to: "New Assigned"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.error, "missing _id");
          done();
        });
    });
    // #10
    it("Update an issue with no fields to update", function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({ _id: issueId })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.error, "no update field(s) sent");
          assert.equal(data._id, issueId);
          done();
        });
    });
    // #11
    it("Update an issue with an invalid _id", function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest")
        .send({
          _id: "Invalid Id",
          issue_text: "New Text",
          assigned_to: "New Assigned"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.error, "could not update");
          assert.equal(data._id, "Invalid Id");
          done();
        });
    });
  });

  describe("DELETE Tests", function() {
    var issueId;
    before(async function() {
      await deleteTestIssues();
      await chai
        .request(server)
        .post("/api/issues/apitest")
        .send(testData[0]);
      var res = await chai
                        .request(server)
                        .post("/api/issues/apitest")
                        .send(testData[1]);
      issueId = res.body._id;
    });
    // #12
    it("Delete an issue", function(done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({
          _id: issueId
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.result, "successfully deleted");
          assert.equal(data._id, issueId);
          done();
        });
    });
    // #13
    it("Delete an issue with an invalid _id", function(done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({
          _id: "Invalid Id"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.error, "could not delete");
          assert.equal(data._id, "Invalid Id");
          done();
        });
    });
    // #14
    it("Delete an issue with missing _id", function(done) {
      chai
        .request(server)
        .delete("/api/issues/apitest")
        .send({
          _id: ""
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          var data = res.body;
          assert.equal(data.error, "missing _id");
          done();
        });
    });
  });
});