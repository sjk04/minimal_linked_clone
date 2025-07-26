const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  following:[{type:ObjectId,ref:"users"}],
});
const Post = new Schema({
  post: String,
  userid: { type: ObjectId, ref: "users" },
  time: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy:[{type:ObjectId,ref:"users"}],
  dislikedBy:[{type:ObjectId,ref:"users"}],
});

const UserModel = mongoose.model("users", User);
const PostModel = mongoose.model("posts", Post);
module.exports = {
  UserModel,
  PostModel,
};
