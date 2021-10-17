const errorController = (err, req, res, next) => {
  try {
    throw(err);
  }
  catch(err) {
    console.error(err);
    res.status(500).send("Unknown error occurred.");    
  }
};

module.exports = errorController;