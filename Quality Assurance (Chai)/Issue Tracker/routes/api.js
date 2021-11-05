'use strict';

const mongooseError = require("mongoose").Error;
const Issue         = require("../model/issue.js");

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      try {
        let project = req.params.project;
        var filter = Object.assign({}, {project_name: project}, req.query);
        var requestedProject = await Issue.find(filter)
                                          .select({ __v         : 0,
                                                    project_name: 0})
                                          .exec();
        
        if(requestedProject) {
          res.json(requestedProject);
        }
      }
      catch(err) {
        console.log(err);
      }
    })
    
    .post(async function (req, res){
      try {
        let project = req.params.project;
        var newIssue = new Issue({project_name: req.params.project,
                                  issue_title : req.body.issue_title,
                                  issue_text  : req.body.issue_text,
                                  created_by  : req.body.created_by,
                                  assigned_to : req.body.assigned_to,
                                  status_text : req.body.status_text});
        var savedIssue = await newIssue.save();
        savedIssue = savedIssue.toObject();
        var {__v, project_name, ...returnObj} = savedIssue;
        res.json(returnObj);
      }
      catch(err) {
        if(err instanceof mongooseError.ValidationError) {
          res.json({error: "required field(s) missing"});
        }
        else {
          console.log(err);
        }
      }
    })
    
    .put(async function (req, res){
      try {
        if(req.body._id) {
          Object.keys(req.body).forEach((key) => {
            if(req.body[key] == "") delete req.body[key];
          });

          if(Object.keys(req.body).length >= 2) {
            let project = req.params.project;
            req.body.updated_on = new Date().toISOString();
            var returnedDoc = await Issue.findByIdAndUpdate(req.body._id, req.body, {runValidators: true});
            if(returnedDoc) {
              res.json({result: "successfully updated", "_id": req.body._id});
            }
            else {
              res.json({error: "could not update", "_id": req.body._id});
            }
          }
          else {
            res.json({error: "no update field(s) sent", "_id": req.body._id });
          }
        }
        else {
          res.json({error: "missing _id"});
        }
      }
      catch(err) {
        if(err instanceof mongooseError.CastError) {
          res.json({error: "could not update", "_id": req.body._id});
        }
        else {
          console.log(err);
        }
      }
    })
    
    .delete(async function (req, res){
      try {
        if(req.body._id) {
          let project = req.params.project;
          var deletedDoc = await Issue.findByIdAndDelete(req.body._id);
          if(deletedDoc) {
            res.json({result: "successfully deleted", "_id": req.body._id});
          }
          else {
            res.json({error: "could not delete", "_id": req.body._id});
          }
        }
        else {
          res.json({error: "missing _id"});
        }
      }
      catch(err) {
        if(err instanceof mongooseError.CastError) {
          res.json({error: "could not delete", "_id": req.body._id});
        }
        else {
          console.log(err);
        }
      }
    });
    
};
