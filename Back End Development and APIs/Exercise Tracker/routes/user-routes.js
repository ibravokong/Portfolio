const express = require('express');
const router = express.Router();
const userControllers = require("../controllers/user-controllers.js");

router.get("/", userControllers.getUsers);
router.get("/:_id/logs", userControllers.getLogs);
router.post("/", userControllers.saveUser);
router.post("/:_id/exercises", userControllers.saveExercise);
module.exports = router;