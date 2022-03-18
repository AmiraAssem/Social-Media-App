const Joi = require("joi");

module.exports = {
    addCommentSchema: {
        body: Joi.object().required().keys({
            description: Joi.string().min(1).max(500).required(),
            postId: Joi.objectId().required()
        })
    },
    updateCommentSchema: {
        body: Joi.object().required().keys({
            description: Joi.string().min(1).max(500).required(),
        }),
        params: Joi.object().required().keys({
            commentId: Joi.objectId().required(),
        })

    },
    deleteCommentSchema: {
        params: Joi.object().required().keys({
            commentId: Joi.objectId().required(),
            postId: Joi.objectId().required()
        })
    },
    getPostCommentsSchema: {
        params: Joi.object().required().keys({
            postId: Joi.objectId().required(),
        })
    }
}