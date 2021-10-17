const express = require('express');
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fileAnalyseControllers = require("../controllers/fileAnalyse-controllers.js");

router.post("/", upload.single("upfile"), fileAnalyseControllers.analyseFile);

module.exports = router;