/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongooseError = require("mongoose").Error;
const Book = require("../models/book.js");

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      try {
        var requestedBooks = await Book.find()
                                       .select({__v     : 0,
                                                comments: 0})
                                       .exec();                   
        res.json(requestedBooks);
      }
      catch(err) {
        console.log(err);
      }
    })
    
    .post(async function (req, res){
      try {
        var newBook = new Book({title: req.body.title});
        var savedBook = await newBook.save();

        res.json(savedBook.toObject());
      }
      catch(err) {
        if(err instanceof mongooseError.ValidationError) {
          res.send("missing required field title");
        }
        else {
          console.log(err);
        }
      }
    })
    
    .delete(async function(req, res){
      try {
        const deletedObj = await Book.deleteMany({});
        if(deletedObj.deletedCount > 0) {
          res.send("complete delete successful");
        }
        else {
          res.send("no books found");
        }
      }
      catch(err) {
        console.log(err);
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      try {
        let bookId = req.params.id;
        var requestedDoc = await Book.findById(bookId)
                                     .select({__v         : 0,
                                              commentcount: 0})
                                     .exec();
        if(requestedDoc) {
          res.json(requestedDoc);
        }
        else {
          res.send("no book exists");
        }
      }
      catch(err) {
        console.log(err);
      }
    })
    
    .post(async function(req, res){
      try {
        let bookId = req.params.id;
        let comment = req.body.comment;
        if(comment === "" || comment === undefined) return res.send("missing required field comment");

        var requestedDoc = await Book.findByIdAndUpdate(bookId, { $push: { comments: comment }, $inc: {"commentcount" : 1} }, {new: true});
        if(requestedDoc) {
          res.json(requestedDoc.toObject());
        }
        else {
          res.send("no book exists");
        }
      }
      catch(err) {
        console.log(err);
      }
    })
    
    .delete(async function(req, res){
      try {
        let bookId = req.params.id;
        var deletedDoc = await Book.findByIdAndDelete(bookId);
        if(deletedDoc) {
          res.send("delete successful");
        }
        else {
          res.send("no book exists");
        }
      }
      catch(err) {
        console.log(err);
      }
    });
  
};
