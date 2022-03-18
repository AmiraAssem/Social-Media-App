const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)


module.exports = {
    addPostSchema: {
        body: Joi.object().required().keys({
            title: Joi.string().max(100).required(),
            description:Joi.string().required(),
        }),
       
    },
    updatePostSchema: {
        body: Joi.object().required().keys({
            title: Joi.string(),
            description:Joi.string()
        }),
        params:Joi.object().required().keys({
            postId: Joi.objectId()
        })
      
    },
  
    deletePostSchema: {
        params:Joi.object().required().keys({
            postId: Joi.objectId(),
        })
    },
    getUserPostsSchema: {
        params:Joi.object().required().keys({
            userId: Joi.objectId()
        })
    },

    reportPostSchema: {
        body:Joi.object().required().keys({
            reportComment: Joi.string().max(100).required(),
        }),
        params:Joi.object().required().keys({
            userId: Joi.objectId(),
            postId: Joi.objectId(),
        })
    },

    blockPostSchema: {
        params:Joi.object().required().keys({
            postId: Joi.objectId(),
        })
    },
}