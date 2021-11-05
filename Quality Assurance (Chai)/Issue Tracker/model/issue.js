const mongoose = require("mongoose");

const SchemaIssue = mongoose.Schema({
  project_name: {type: String, required: true},
  issue_title : {type: String, required: true},
  issue_text  : {type: String, required: true},
  created_by  : {type: String, required: true},
  assigned_to : {type: String, default: ""},
  status_text : {type: String, default: ""},
  created_on  : {type: String, required: true, default: new Date().toISOString()},
  updated_on  : {type: String, required: true, default: new Date().toISOString()},
  open        : {type: Boolean, required: true, default: true}
});

module.exports = mongoose.model("Issue", SchemaIssue);