const express = require("express");
const app = express();
let bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const { Schema } = mongoose;
const postsSchema = new Schema({
  title: String,
  body: String,
  likeCount: Number,
});

const Post = mongoose.model("post", postsSchema);

// GET
app.get("/api/posts", (req, res) => {
  Post.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// POST
app.post("/api/posts", (req, res) => {
  let post = new Post({
    title: req.body.title,
    body: req.body.body,
    likeCount: req.body.likeCount,
  });
  post.save();
  res.status(201).json(post);
});

// GET BY ID
app.get("/api/posts/:id", (req, res) => {
  let id = req.params.id;
  Post.findById(id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// DELETE
app.delete("/api/posts/:id", (req, res) => {
  let id = req.params.id;
  Post.findByIdAndRemove(id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// PUT
app.put("/api/posts/:id", (req, res) => {
  let id = req.params.id;
  let updatedPost = {
    title: req.body.title,
    body: req.body.body,
    likeCount: req.body.likeCount,
  };

  Post.findByIdAndUpdate(id, updatedPost, { new: true })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.listen(8080);
