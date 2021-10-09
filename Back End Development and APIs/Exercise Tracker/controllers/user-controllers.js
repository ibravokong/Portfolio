const mongooseError = require("mongoose").Error;
const User = require("../models/user.js");

const getUsers = async (req, res, next) => {
  try {
    var result = await User.find()
                           .select({__v: 0,
                                    log: 0})
                           .exec();
    res.json(result);
  }
  catch(err) {
    next(err);
  }
};

const getLogs = async (req, res, next) => {
  try {
    var requestedUser = await User.findById(req.params._id);

    if(requestedUser) {
      requestedUser = requestedUser.toObject();

      if(req.query != undefined) {
        var {from, to, limit} = req.query;
        var filteredLogs = requestedUser.log;
        if(from != undefined && to != undefined) {
          fromDate = new Date(from);
          toDate = new Date(to);
        
          filteredLogs.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          });
          filteredLogs = filteredLogs.filter((exercise) => {
            date = new Date(exercise.date);
            return ((date >= fromDate) && (date <= toDate));
          });
        }
        
        if(limit != undefined) {
          while(filteredLogs.length > limit) {
            filteredLogs.pop();
          }
        }

        requestedUser.log = filteredLogs;
      }

      requestedUser.count = requestedUser.log.length;
      var {__v, ...returnObj} = requestedUser;
      res.json(returnObj);
    }
    else {
      throw("User not found");
    }
  }
  catch(err) {
    next(err);
  }
};

const saveUser = async (req, res, next) => {
  try {
    var newUser = new User({username: req.body.username,
                            log: []});
    var savedUser = await newUser.save();
    savedUser = savedUser.toObject();
    var {__v, ...returnObj} = savedUser;
    res.json(returnObj);
  }
  catch(err) {
    next(err);
  }
};

const saveExercise = async (req, res, next) => {
  try {
    var userToUpdate = await User.findById(req.params._id);
    
    if(userToUpdate) {
      var exerciseDate = validateAndFormatDate(req.body.date);
      
      var newExercise = {description: req.body.description,
                         duration:    parseInt(req.body.duration),
                         date:        exerciseDate.toDateString()};
      userToUpdate.log.push(newExercise);
      await userToUpdate.save();
      
      var returnObj = Object.assign({}, newExercise);
      returnObj["_id"] = userToUpdate["_id"];
      returnObj["username"] = userToUpdate["username"];
      res.json(returnObj);
    }
    else {
      throw("User not found");
    }
  }
  catch(err) {
    next(err);
  }
};

const validateAndFormatDate = (date) => {
  var exerciseDate = !["", undefined].includes(date) ? new Date(date) : new Date();
  if(isNaN(exerciseDate.getTime())) {
    throw("Invalid Date");
  }

  return exerciseDate;
}

module.exports = {
  getUsers,
  getLogs,
  saveUser,
  saveExercise
};