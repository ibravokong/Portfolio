const mongooseError = require("mongoose").Error;

const handleValidationError = (err, res) => {
  var fieldArray = [];
  for(var key in err.errors) {
    fieldArray.push(err.errors[key].path);
  }

  var errorMessage = [];
  fieldArray.forEach((key) => {
    errorMessage.push(`${key} is invalid.`);
  });
  res.status(400).send({errorType: "ValidationKeyError",
                        messages: errorMessage,
                        fields: fieldArray});
};

const handleCastError = (err, res) => {
  var objField = err.path == "exercises" ? err.reason.path : err.path;
  var fieldArray = [objField];
  
  var errorMessage = [];
  fieldArray.forEach((key) => {
    errorMessage.push(`${key} is invalid.`);
  });
  res.status(400).send({errorType: "HandleCastError",
                        messages: errorMessage,
                        fields: fieldArray});
};

const handleDuplicateKeyError = (err, res) => {
  var fieldArray = Object.keys(err.keyValue);
  var errorMessage = [];
  fieldArray.forEach((key) => {
    errorMessage.push(`${key} already exists.`);
  });
  res.status(409).send({errorType: "DuplicateKeyError",
                        messages: errorMessage,
                        fields: fieldArray});
};

const errorController = (err, req, res, next) => {
  try {
    if(err.name === "ValidationError") {
      return err = handleValidationError(err, res);
    }
    if(err.name === "CastError") {
      return err = handleCastError(err, res);
    }
    if(err.code && err.code == 11000) {
      return err = handleDuplicateKeyError(err, res);
    }
    if(err == "Invalid Date") {
      return res.status(400).send({errorType: "InvalidDateError",
                                   messages: "Date is invalid.",
                                   fields: "date"});
    }
    if(err == "User not found") {
      return res.status(400).send({errorType: "NotFoundError",
                                   messages: "User id not found.",
                                   fields: "id"});
    }
    if(err == "Invalid limit") {
      return res.status(400).send({errorType: "InvalidLimitError",
                                   messages: "Invalid limit parameter.",
                                   fields: "limit"});
    }
    throw(err);
  }
  catch(err) {
    console.error(err);
    res.status(500).send("Unknown error occurred.");    
  }
};

module.exports = errorController;