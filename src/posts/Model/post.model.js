const mongoose = require("mongoose");
const postSchema = require("../Schema/post.schema");
const Post = mongoose.model("post", postSchema);

module.exports = Post;
