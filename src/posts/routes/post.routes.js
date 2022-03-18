const isAuthorized = require("../../../common/middleware/isAuthorized");
const validateRequest = require("../../../common/middleware/validateRequest");
const {  addNewPost,  editPost, deletePost, getUserProfilePosts , getAllPosts, reportPost, blockPost, getPost } = require("../controller/post.controller");
const { ADD_POST, DELETE_POST, REPORT_POST, BLOCK_POSTS, GET_ALL_POSTS, GET_USER_POSTS, EDIT_POST } = require("../endpoints");
const { addPostSchema, updatePostSchema, deletePostSchema, getUserPostsSchema, reportPostSchema, blockPostSchema } = require("../joi/postValidation");

const router = require("express").Router();

router.get("/posts", isAuthorized(GET_ALL_POSTS), getAllPosts);

router.get("/users/posts/:userId",isAuthorized(GET_USER_POSTS), validateRequest(getUserPostsSchema),  getUserProfilePosts );

router.post("/posts", isAuthorized(ADD_POST), validateRequest(addPostSchema), addNewPost);

router.put("/posts/:postId", isAuthorized(EDIT_POST), validateRequest(updatePostSchema), editPost);

router.delete("/posts/:postId",isAuthorized(DELETE_POST), validateRequest(deletePostSchema),  deletePost);

router.post("/posts/report/:postId",isAuthorized(REPORT_POST), validateRequest(reportPostSchema),  reportPost);

router.put("/posts/block/:postId", validateRequest(blockPostSchema), isAuthorized(BLOCK_POSTS), blockPost);

router.put("/posts/:postId", getPost);



module.exports = router;
