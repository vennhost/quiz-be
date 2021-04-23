const express = require("express");
const Score = require("../models/scores");
const router2 = require("./users");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const scores = await Score.find({});
    res.send(scores);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  const score = await (await Score.findById(req.params.id)).populate("User");
  try {
    if (score) {
      res.send(score);
    } else {
      res.status(404).send("Score not found");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/user/:userId", async (req, res) => {
  const userScore = await Score.find({ user: req.params.userId });
  try {
    if (userScore) {
      res.send(userScore);
    } else {
      res.status(404).send("Score not found");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const score = new Score({
      score: req.body.score,
      user: req.body.user,
      remark: req.body.remark,
    });
    score.save();
    res.status(201).send({ score, msg: "Score Created" });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const score = await findByIdAndDelete(req.params.id);
    res.send({ status: "success", msg: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
