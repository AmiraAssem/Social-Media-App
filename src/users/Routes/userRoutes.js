const isAuthorized = require("../../../common/middleware/isAuthorized");
const validateRequest = require("../../../common/middleware/validateRequest");
const upload = require("../../../common/services/uploadImage");
const { signUp, updateProfile, signIn, deactivateAccount, verifyUser, updatePassword, forgotPassword, resetPassword } = require("../Controller/userController");
const { DEACTIVATE_ACCOUNT, UPDATE_USER_PROFILE, UPDATE_USER_PASSWORD } = require("../endpoints");
const { updateUserProfileSchema, updateUserPasswordSchema, forgotPasswordSchema, resetPasswordSchema,  signInSchema, signUpSchema } = require("../joi/userValidation");



const route = require("express").Router();

route.post("/users/register", upload.single("userImage"), validateRequest(signUpSchema), signUp)

route.get("/verify/:token", verifyUser)

route.post("/users/login", validateRequest(signInSchema), signIn)

route.put("/users/update",isAuthorized(UPDATE_USER_PROFILE), validateRequest(updateUserProfileSchema),  updateProfile)

route.put("/users/updatePassword/:id",isAuthorized(UPDATE_USER_PASSWORD), validateRequest(updateUserPasswordSchema),  updatePassword)

route.delete("/users/deactivate/:id", isAuthorized(DEACTIVATE_ACCOUNT), deactivateAccount)

route.post("/users/forgot-password", validateRequest(forgotPasswordSchema), forgotPassword)

route.put("/users/reset-password/:resetToken/:userToken", validateRequest(resetPasswordSchema), resetPassword)








module.exports = route