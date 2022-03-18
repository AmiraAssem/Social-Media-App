const { StatusCodes } = require("http-status-codes");
const User = require("../Model/userModel");
const sendEmail = require("../../../common/services/sendEmail");



const signUp = async (req, res) => {
    const { userName, email, password, phone, location } = req.body;
    try {
        const newUser = new User({ userName, email, password, phone, location, userImage: `http://localhost:5000/${req.file.path}` });
        const data = await newUser.save();

        let token = User.generateToken(data);

        await sendEmail(
            [email],
            "EMAIL VERFICIATION",
            `<h1> Welcome</h1>
            <a href="http://localhost:5000/verify/${token}" > Verify</a>`
        );

        res
            .status(StatusCodes.CREATED)
            .json({ message: "Added successfully", data: data })
    }
    catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error })
    }

}

const verifyUser = async (req, res) => {
    const { token } = req.params;
    var decoded = User.verifyToken(token);
    const user = await User.findOne({ _id: decoded._id });
    if (user) {
        await User.updateOne(
            { _id: decoded._id },
            {
                verified: true,
            }
        );
        res.status(StatusCodes.OK).json({ message: "email has been verified" });
    } else
        res.status(StatusCodes.FORBIDDEN).json({ message: "FORBIDDEN" });
};


const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user) {
            if (user.isBlocked) {
                res
                    .status(StatusCodes.FORBIDDEN)
                    .json({ message: "Sorry You cannot access your account, you have been blocked!" });
            } else {
                const match = await User.comparePassword(password, user.password)
                if (match) {
                    //restore user account by login
                    if (user.deleted) await User.restore({ email });
                    var token = User.generateToken(user);
                    const { password, ...info } = user._doc;
                    res
                        .status(StatusCodes.OK)
                        .json({ message: "Login successfully", data: info, token: token });
                }
                else throw "Password is not correct"
            }
        }
        else throw "invalid email"
    }
    catch (error) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: error })
    }

}


const updateProfile = async (req, res) => {
    const { ...info } = req.body;
    const profileOwner = req.user;
    try {
        const user = await User.findByIdAndUpdate(profileOwner._id, { ...info }, { new: true });
        const { password, ...userInfo } = user._doc;
        res
            .status(StatusCodes.OK)
            .json({ message: "updated successfully", data: userInfo })
    }
    catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error })
    }

}


const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    try {
        if (req.user._id.equals(id)) {
            const user = await User.findById(req.user._id);
            const match = await User.comparePassword(oldPassword, user.password);
            if (match) {
                user.password = newPassword;
                await user.save();
                res
                .status(StatusCodes.OK)
                .json({ message: "Password have been Updated " })
            }
            else throw "Password is not correct"
        }
        else throw "UNAUTHORIZED"

    } catch (err) {
        res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: err })

    }
}


const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email })
    try {
        if (user) {
            const resetToken = await user.getResetPasswordToken();
            await user.save();
            const userToken = User.generateToken(user);
            const resetLink = `${process.env.BASE_URL}/users/reset-password/${resetToken}/${userToken}`;

            await sendEmail(
                [email],
                "Reset Password Link",
                `<p>You requested for reset password, kindly make a PUT request to:<h1>${resetLink}</h1>to reset your password</p>`
            );
            res
            .status(StatusCodes.OK)
            .json({ message: "The reset password link has been sent to your email" })

        }
        else throw "INVALID EMAIL"

    } catch (err) {
        user.resetToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err })

    }
}

const resetPassword = async (req, res) => {
    const { resetToken, userToken } = req.params;
    const { newPassword } = req.body;
    try {
        const decoded = User.verifyToken(userToken)
        const user = await User.findOne({ _id: decoded._id, resetPassword: resetToken, resetPasswordExpire: { $gt: Date.now() } });
        if (user) {

            user.password = newPassword;
            user.resetPassword = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            res
            .status(StatusCodes.OK)
            .json({ message: "Your password has been updated successfully" })

        }
        else throw "invalid token"

    } catch (err) {
        res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: err })

    }
}


const deactivateAccount = async (req, res) => {
    const accountOwner = req.user;
    const { id } = req.params;
    try {
        if (accountOwner._id.equals(id)) {
            await User.deleteById(accountOwner._id)
            res
                .status(StatusCodes.OK)
                .json({ message: "Deactivated successfully" })
        }
        else throw "UNAUTHORIZED"
    }
    catch (error) {
        res
            .status(StatusCodes.FORBIDDEN)
            .json({ error: error })
    }

}






module.exports = {
    signUp,
    signIn,
    updateProfile,
    deactivateAccount,
    verifyUser,
    updatePassword,
    forgotPassword,
    resetPassword
}