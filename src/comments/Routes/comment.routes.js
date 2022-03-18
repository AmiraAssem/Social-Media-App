const validateRequest = require("../../../common/middleware/validateRequest");
const isAuthorized = require("../../../common/middleware/isAuthorized");
const {
  addCommentHandelr,
  deleteCommentHandelr,
  updateCommentHandelr,
  getPostCommentsHandelr,

} = require("../controller/comment.controller");
const { ADD_COMMENT, DELETE_COMMENT, EDIT_COMMENT, GET_POST_COMMENTS } = require("../endpoints");

const { addCommentSchema, updateCommentSchema, deleteCommentSchema } = require("../joi/commentValidation");

const router = require("express").Router();


router.get("/post/comments/:postId", isAuthorized(GET_POST_COMMENTS), getPostCommentsHandelr);

router.post("/comments", validateRequest(addCommentSchema), isAuthorized(ADD_COMMENT), addCommentHandelr);

router.put("/comments/:commentId", validateRequest(updateCommentSchema), isAuthorized(EDIT_COMMENT), updateCommentHandelr);

router.delete("/comments/:commentId/:postId", validateRequest(deleteCommentSchema), isAuthorized(DELETE_COMMENT), deleteCommentHandelr);

module.exports = router;
