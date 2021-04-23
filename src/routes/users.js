const express = require("express");
const User = require("../models/users");
const { basic, adminOnly, getToken } = require("../utils/auth");
const passport = require("passport");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.send(error);
  }
});

router.get("/:id", async (req, res) => {
  const isIDValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (isIDValid) {
    try {
      const user = await (await User.findById(req.params.id)).populate("loan");
      user ? res.send(user) : res.status(404).send("No user found!");
      res.send(user);
    } catch (error) {
      res.send(error);
    }
  } else {
    res.status(404).send("User ID not Valid");
  }
});

router.post("/register", async (req, res) => {
  try {
    const user = await User.register({ ...req.body }, req.body.password);
    const token = getToken({ _id: user._id });
    res.send({ access_token: token, user: user });
  } catch (error) {
    res.send(error);
  }
});

router.post("/login", passport.authenticate("local"), async (req, res) => {
  const token = await getToken({ _id: req.user._id });
  res.send({
    acess_token: token,
    user: req.user,
  });
});

router.post("/activate/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { active: true });

    res.send("Activated");
  } catch (error) {
    console.log(error);
  }
});

router.post("/deactivate/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { active: false });

    res.send("Deactivated");
  } catch (error) {
    console.log(error);
  }
});

router.post("/unfollow/:id/:followerId", async (req, res) => {
  const user = await User.findById(req.params.id);
  const follower = await User.findById(req.params.followerId);

  try {
    await User.findByIdAndUpdate(user, {
      $pull: { followers: req.params.followerIdr },
    }).then(
      await User.findByIdAndUpdate(follower, {
        $pull: { followings: req.params.id },
      })
    );

    res.send("Done");
  } catch (error) {
    console.log(error);
  }
});

router.post("/follow/:id/:followerId", async (req, res) => {
  const user = await User.findById(req.params.id);
  const follower = await User.findById(req.params.followerId);

  try {
    await User.findByIdAndUpdate(user, {
      $push: { followers: follower },
    }).then(
      await User.findByIdAndUpdate(follower, {
        $push: { followings: user },
      })
    );

    res.send("Done");
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      res.send({ message: "User Deleted", deletedUser });
    } else {
      res.status(401).send("You are not authorized to delete this User.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

/* router.get("/", passport.authenticate("jwt"), async (req, res)=>{
    res.send(await User.find({}))
})
router.post("/register", async(req, res)=>{
    try{
        const user = await User.register(req.body, req.body.password);
        const token = getToken({_id: user._id})
        res.send(
            {access_token: token,
                user: user}
        )
    }
    catch(error){
        console.log(error)
        res.status(500).send(error)
    }
})
router.post("/login", passport.authenticate("local"), async (req, res) => {
    const token = await getToken({_id: req.user._id})
    res.send({
        acess_token: token,
        user: req.user
    })
})
router.post("/fblogin", passport.authenticate("fb"), async (req, res) => {
    const token = await getToken({_id: req.user._id})
    res.send({
        acess_token: token,
        user: req.user
    })
})
router.post("/refresh", passport.authenticate("jwt"), async(req, res)=>{
    const token = getToken({ _id: req.user._id })
    res.send({
        access_token: token,
        user: req.user
    })
})
router.get("/userinfo", passport.authenticate("jwt"), async (req, res)=>{
    res.send(req.user);
})
router.post("/resetpassword", passport.authenticate("local"), async(req, res)=>{
    const user = await User.findById(req.user._id)
    const result = await user.setPassword(req.body.newPassword)
    user.save() // <= remember to save the object, since setPassword is not committing to the db
    res.send(result) 
}
) */

module.exports = router;
