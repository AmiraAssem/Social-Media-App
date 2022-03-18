const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {

    deleteAdminSchema: {
        params:Joi.object().required().keys({
            id: Joi.objectId()
        })
    },

    blockUserSchema: {
        params:Joi.object().required().keys({
            id: Joi.objectId()
        })
    }
}