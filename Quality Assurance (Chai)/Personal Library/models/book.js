const mongoose = require("mongoose");

const SchemaBook = mongoose.Schema({
  title: { type: String, required: true },
  comments: [{ type: String }],
  commentcount: { type: Number, default: 0 }
});

SchemaBook.set("toObject", {
  transform: function(doc, ret, options) {
    var retObj = {
      _id         : ret._id,
      title       : ret.title,
      comments    : ret.comments
    };
    return retObj;
  }
});

module.exports = mongoose.model("Book", SchemaBook);