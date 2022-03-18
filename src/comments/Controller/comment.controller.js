const Post = require("../../posts/Model/post.model");
const Report = require('../../posts/Model/report.model')
const Comment = require("../Model/comment.model");
const { StatusCodes } = require("http-status-codes");


exports.getPostCommentsHandelr = async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 6 } = req.query;
  try {
    let postArr = [];

    const reportedPost = await Report.find({ postId });

    if (reportedPost.length) throw "This post is currently unavailable";

    const cursor = await Post.find({ _id: postId, isBlocked: false }).populate("createdBy", 'userName').limit(limit * 1)
      .skip((page - 1) * limit).cursor();

    for (
      let doc = await cursor.next();
      doc != null;
      doc = await cursor.next()
    ) {
      const comments = await Comment.find({ postId: doc._id }).populate(
        "createdBy", 'userName'
      );
      const obj = { ...doc._doc, comments };
      postArr.push(obj);
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "success!", data: postArr })

  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error })
  }
};

exports.addCommentHandelr = async (req, res) => {
  const { description, postId } = req.body;
  try {
    const post = await Post.findById(postId);

    if (!post) throw "INVALID ID";

    const newComment = new Comment({
      description, createdBy: req.user._id, postId
    });

    const comment = await newComment.save();

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Created successfully", data: comment })
  }
  catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error })
  }
};

exports.deleteCommentHandelr = async (req, res) => {
  const { commentId, postId } = req.params;
  try {
    const commentOwner = await Comment.findById(commentId);
    const postOwner = await Post.findById(postId);

    if (!commentOwner || !postOwner) throw "INVALID ID";

    if (req.user._id.equals(commentOwner.createdBy) || req.user._id.equals(postOwner.createdBy)) {
      await Comment.deleteOne({ _id: commentId });
      res
        .status(StatusCodes.OK)
        .json({ message: "deleted successfully" })
    }
    else throw "UNOUTHORIZED"

  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error })
  }
};

exports.updateCommentHandelr = async (req, res) => {
  const { commentId } = req.params;
  const { description } = req.body
  try {
    const comment = await Comment.findById(commentId);

    if (!comment) throw "INVALID ID";

    if (req.user._id.equals(comment.createdBy)) {
      const comment = await Comment.findByIdAndUpdate(commentId, { description }, { new: true });
      res
        .status(StatusCodes.OK)
        .json({ message: "Updated successfully", data: comment })
    }
    else throw "UNAUTHORIZED"

  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error })
  }
};



