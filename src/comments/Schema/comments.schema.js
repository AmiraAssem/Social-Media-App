const { Schema } = require("mongoose");
const commentSchema = new Schema(
  {
    description: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    postId: { type: Schema.Types.ObjectId, ref: "post" }
  },
  {
    timestamps: true,
  }
);
module.exports = commentSchema;
