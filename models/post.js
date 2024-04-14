const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  postedBy: { type: ObjectId, ref: "User" }, // Add this line
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  likes: [{ type: ObjectId, ref: "User" }],
comments: [{
  text: String,
  postedBy:{type: ObjectId, ref:"User"}
}],

// comments: [commentSchema], // Update this line
  
postedBy: {
    type: ObjectId,
    ref: "User",
  },
},{timestamps : true});

mongoose.model("Post", postSchema);
