const isAuthorized = require("../../../common/middleware/isAuthorized");
const validateRequest = require("../../../common/middleware/validateRequest");
const upload = require("../../../common/services/uploadImage");
const { superAdminSignUp, addAdmin, getAllAdmins, deleteAdmin, blockUser } = require("../Controller/superAdminController");

const { BLOCK_USER, ADD_ADMIN, DELETE_ADMIN, GET_ALL_ADMINS } = require("../endpoints");
const { deleteAdminSchema, blockUserSchema } = require("../joi/adminValidation");
const { signUpSchema } = require("../joi/userValidation");

const route = require("express").Router();


route.post("/superAdmins", upload.single("userImage"), validateRequest(signUpSchema), superAdminSignUp)

route.post("/admins", upload.single("userImage"), validateRequest(signUpSchema), isAuthorized(ADD_ADMIN), addAdmin)

route.get("/admins", isAuthorized(GET_ALL_ADMINS), getAllAdmins)

route.delete("/admins/:id", validateRequest(deleteAdminSchema), isAuthorized(DELETE_ADMIN), deleteAdmin)

route.delete("/users/block/:id", validateRequest(blockUserSchema), isAuthorized(BLOCK_USER), blockUser)

module.exports = route