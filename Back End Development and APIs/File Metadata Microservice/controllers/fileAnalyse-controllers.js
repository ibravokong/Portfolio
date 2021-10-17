const analyseFile = async (req, res, next) => {
  try {
    var fileName = req.file.originalname.split(".")[0];
    var returnObj = {name: fileName,
                     type: req.file.mimetype,
                     size: req.file.size};
    res.json(returnObj);
  }
  catch(err) {
    next(err);
  }
};

module.exports = {
  analyseFile
};