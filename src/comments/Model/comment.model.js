const mongoose = require("mongoose");
const commentSchema = require("../Schema/comments.schema");

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;
