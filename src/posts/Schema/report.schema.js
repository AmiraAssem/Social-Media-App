const { Schema } = require("mongoose");

const reportSchema = new Schema(
    {
        reportedBy: { type: Schema.Types.ObjectId, ref: "user" },
        postId: { type: Schema.Types.ObjectId, ref: "post" },
        reportComment: String
    },
    {
        timestamps: true,
    }
);
module.exports = reportSchema;
