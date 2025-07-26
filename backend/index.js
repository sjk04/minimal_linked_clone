const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const jwtrandom = "random";
const bcrypt = require("bcrypt");

const cors = require("cors");
app.use(cors());

const { z } = require("zod");
const { PostModel, UserModel } = require("./database");

mongoose.connect(
  "mongodb+srv://simjkurian:sSvNo5LkRz8DRRsT@cluster0.trbe0nj.mongodb.net/linkedin-database"
);
app.post("/signup", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.json({ message: "User already exists signin" });
  }
  const hashedPassword = await bcrypt.hash(password, 5);
  await UserModel.create({
    email: email,
    password: hashedPassword,
    name: name,
  });
  return res.json({ message: "User successfully signed up" });
});

app.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.json({ message: "User does not exist" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (passwordMatch) {
    const token = jwt.sign({ id: user._id.toString() }, jwtrandom);
    return res.json({ token });
  } else {
    return res.json({ message: "Incorrect credentials" });
  }
});

function auth(req, res, next) {
  const token = req.headers.token;
  const decoded = jwt.verify(token, jwtrandom);
  if (decoded) {
    req.userid = decoded.id;
    req.name = decoded.name;
    next();
  } else {
    res.json({ message: "you are not logged" });
  }
}

app.post("/post", auth, async function (req, res) {
  const userid = req.userid;

  const post = req.body.post;
  await PostModel.create({
    post: post,
    userid: userid,
  });

  res.json({
    userid: userid,
  });
});

app.get("/post", auth, async function (req, res) {
  const post = await PostModel.find({})
    .sort({ time: -1 })
    .populate("userid", "name");

  console.log(post);
  res.json({
    post,
  });
});
app.post("/like/:postId", auth, async function (req, res) {
  const postId = req.params.postId;
  const userId = req.userid;

  try {
    const post = await PostModel.findById(postId);
    if (post.likedBy.includes(userId)) {
      return res.json({ message: "you already liked this post" });
    }

    const updatedPost = await PostModel.findByIdAndUpdate(postId, {
      $inc: { likes: 1 },
      $addToSet:{likedBy:userId}
    },
   {new:true}
  );
    res.json({ message: "Liked successfully", likes: updatedPost.likes,likedBy:updatedPost.likedBy });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to like the post" });
  }
});
app.post("/dislike/:postId", auth, async function (req, res) {
  const postId = req.params.postId;
  const userId = req.userid;

  try {
    const post=await PostModel.findById(postId);
    if(post.dislikedBy.includes(userId))
    {
      return res.json({message:"youu already disliked this post"})
    }
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $inc: { dislikes: 1 },
        $addToSet:{dislikedBy:userId} },
      { new: true }
    );
    res.json({ message: "disliked successfully", likes: updatedPost.likes,dislikedBy:updatedPost.dislikedBy});
  } catch (error) {
    res.status(500).json({ message: "Failed to dislike the post" });
  }
});

app.post("/follow/:useridtofollow", auth, async function (req, res) {
  const useridtofollow = req.params.useridtofollow;
  const userid = req.userid;

  if (userid == useridtofollow) {
    res.json({ message: "you cannot follow yourself" });
  } else {
    await UserModel.findByIdAndUpdate(userid, {
      $addToSet: { following: useridtofollow },
    });
    res.json({ message: "Followed successfully" });
  }
});
app.post("/unfollow/:useridtounfollow", auth, async function (req, res) {
  const useridtounfollow = req.params.useridtounfollow;
  const userid = req.userid;

  if (userid == useridtounfollow) {
    res.json({ message: "you cannot follow yourself" });
  } else {
    await UserModel.findByIdAndUpdate(userid, {
      $pull: { following: useridtounfollow },
    });
    res.json({ message: "unfollowed " });
  }
});

app.get("/me", auth, async function (req, res) {
  const user = await UserModel.findById(req.userid);
  const following = user.following;
  console.log(following);
  res.json({ following: following || [] });
});

//------------------------------------------

app.get("/user/:userId", auth, async function (req, res) {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

app.get("/user/:userId/posts", auth, async function (req, res) {
  try {
    const userId = req.params.userId;
    const posts = await PostModel.find({ userid: userId })
      .sort({ time: -1 })
      .populate("userid", "name");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user posts" });
  }
});

app.get("/users", auth, async function (req, res) {
  try {
    const users = await UserModel.find({ _id: { $ne: req.userid } }).select(
      "-password"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});
//----------------------------------------------
app.listen(4000);

/*
app.get("/post", auth, async function (req, res) {
  const posts = await PostModel.find({})
    .sort({ createdAt: -1 })            // newest posts first
    .populate("userid", "name");        // also show user's name

  res.json({ posts });
});
*/
