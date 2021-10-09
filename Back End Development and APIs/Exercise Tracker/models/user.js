const mongoose = require("mongoose");

const SchemaUser = mongoose.Schema({
	username: {type:     String, 
             required: [true, "Username required"],
             unique:   true},
  log: [{description: {type: String, required: true},
         duration: {type: Number, required: true},
         date: {type: String}}]
});

module.exports = mongoose.model("User", SchemaUser);