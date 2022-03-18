const { Schema } = require("mongoose");
const postSchema = new Schema(
  {
    title: String,
    description: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    isBlocked: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

module.exports = postSchema;
