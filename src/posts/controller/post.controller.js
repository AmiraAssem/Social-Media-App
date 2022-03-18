const Post = require("../Model/post.model");
const { StatusCodes } = require("http-status-codes");
const Report = require("../Model/report.model");
const User = require("../../users/Model/userModel")
const { pagination } = require("../../../common/services/pagination")
const Comment = require("../../comments/Model/comment.model");



exports.getAllPosts = async (req, res) => {
  const { page = 1, size = 6 } = req.query;
  try {
    // mongoose delete plugin override find method so doesnot get deleted users automatically 
    let postArr = [];
    const { limit, skip } = pagination(page, size);
    const invalidUsers = await User.find({isBlocked:true}).distinct('_id');
    const reportedPosts = await Report.find({}).distinct('postId')
    const cursor = await Post.find({ _id: { $nin: reportedPosts }, isBlocked: false, createdBy: { $nin: invalidUsers } }).populate("createdBy", 'userName').limit(limit)
      .skip(skip).cursor();
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

exports.getPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId).populate("createdBy", 'userName');
    const postOwner = (post) ? await User.findById(post.createdBy) : none;
    if (!postOwner || postOwner.isBlocked || postOwner.deleted) throw "invalid Id";
    res
      .status(StatusCodes.OK)
      .json({ message: "success!", data: post })

  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: error })
  }

};

exports.getUserProfilePosts = async (req, res) => {
  const { userId } = req.params;
  const { page = 1, size = 6 } = req.query;
  try {
    if (req.user._id.equals(userId) || req.user.role == 'admin') {
      const user = await User.findOne({ _id: userId, isBlocked: false, deleted: false });
      if (user) {
        const { skip, limit } = pagination(page, size);
        let postArr = [];
        const reportedPosts = await Report.find({}).distinct('postId')
        const cursor = await Post.find({ _id: { $nin: reportedPosts }, isBlocked: false, createdBy: userId }).populate("createdBy", 'userName').limit(limit)
          .skip(skip).cursor();
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
      }
      else throw "User is not Found"

    }
    else throw 'UNAUTHORIZED'

  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error })
  }

};

exports.addNewPost = async (req, res) => {
  const { title, description } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user.verified && !user.isBlocked) {
      const newPost = new Post({ title, description, createdBy: req.user._id });
      const data = await newPost.save();
      res
        .status(StatusCodes.CREATED)
        .json({ message: "Created successfully", data: data })
    }
    else throw "UNAUTHORIZED"

  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error })
  }
};

exports.editPost = async (req, res) => {
  const { postId } = req.params
  const { ...content } = req.body;
  try {
    const found = await Post.findById(postId);

    if (!found) throw "INVALID post ID";

    if (req.user._id.equals(found.createdBy)) {

      const post = await Post.findByIdAndUpdate(postId, { ...content }, { new: true });
      res
        .status(StatusCodes.OK)
        .json({ message: "Updated successfully", data: post })
    }
    else throw "UNAUTHORIZED";

  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: error })
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params
  try {

    const found = await Post.findById(postId);

    if (!found) throw "INVALID post ID";

    if (req.user._id.equals(found.createdBy) || req.user.role == 'admin' || req.user.role == 'superAdmin') {
      await Post.findByIdAndDelete(postId);
      res
        .status(StatusCodes.OK)
        .json({ message: "Deleted successfully" })

    }
    else throw "UNAUTHORIZED";

  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: error })
  }
};

exports.reportPost = async (req, res) => {
  const { postId } = req.params;
  const { reportComment } = req.body;
  try {
    const report = new Report({ reportedBy: req.user._id, postId, reportComment })
    await report.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "Reported successfully" })

  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error })
  }
};


exports.blockPost = async (req, res) => {
  const { postId } = req.params
  try {
    const reported = await Report.find({ postId });
    if (reported) {
      await Post.findByIdAndUpdate(postId, { $set: { isBlocked: true } })
      res
        .status(StatusCodes.OK)
        .json({ message: "Blocked successfully" })
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error })
  }
};




