const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requiredLogin");
const Post = mongoose.model("Post");

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort('-createdAt')
    .then((posts) => {
      // console.log(posts)
      res.json({ posts });
    })
    .catch((err) => {
      console.error("Error fetching posts:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.get("/getsubpost", requireLogin, (req, res) => {
  Post.find({postedBy :{$in:req.user.following}})
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .sort('-createdAt')
    .then((posts) => {
      // console.log(posts)
      res.json({ posts });
    })
    .catch((err) => {
      console.error("Error fetching posts:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(422).json({ error: err });
    });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(422).json({ error: err });
    });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .then((result) => {
      console.log("Comment added successfully:", result);
      res.json(result);
    })
    .catch((err) => {
      console.error("Error adding comment:", err);
      res.status(422).json({ error: err });
    });
});

router.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .then((post) => {
      if (!post) {
        return res
          .status(422)
          .json({ error: "Post not found or already deleted" });
      }

      if (post.postedBy._id.toString() === req.user._id.toString()) {
        return Post.deleteOne({ _id: req.params.postId })
          .then(() => {
            // After successfully deleting, fetch and send the updated list of posts
            return Post.find()
              .populate("postedBy", "_id name")
              .populate("comments.postedBy", "_id name")
              .then((posts) => {
                res.json({ posts });
              })
              .catch((error) => {
                console.error("Error fetching posts:", error);
                res.status(500).json({ error: "Internal server error" });
              });
          })
          .catch((error) => {
            console.error("Error deleting post:", error);
            return res.status(500).json({ error: "Internal server error" });
          });
      } else {
        return res
          .status(401)
          .json({ error: "You are not authorized to delete this post" });
      }
    })
    .catch((error) => {
      console.error("Error finding post:", error);
      return res.status(500).json({ error: "Internal server error" });
    });
});

// routes/post.js

router.delete("/deletecomment/:postId/:commentId", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.params.postId,
    {
      $pull: { comments: { _id: req.params.commentId } },
    },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error("Error deleting comment:", err);
      res.status(422).json({ error: err });
    });
});


module.exports = router;
