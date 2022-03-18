const { StatusCodes } = require("http-status-codes");
const sendEmail = require("../../../common/services/sendEmail");
const User = require("../Model/userModel");
const { pagination } = require("../../../common/services/pagination")

const superAdminSignUp = async (req, res) => {
    const { userName, email, password, phone, location } = req.body;
    try {
        const newSuperAdmin = new User({ userName, email, password, phone, location, role: 'superAdmin' });
        const data = await newSuperAdmin.save();

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

const addAdmin = async (req, res) => {
    const { userName, email, password, phone, location } = req.body;
    try {

        const newAdmin = new User({ userName, email, password, phone, location, role: 'admin', userImage: `http://localhost:5000/${req.file.path}` });
        const data = await newAdmin.save();

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

const getAllAdmins = async (req, res) => {

    const { page = 1, size = 3 } = req.query;
    try {
        const { skip, limit } = pagination(page, size);
        const admins = await User.find({ role: 'admin' }).limit(limit)
            .skip(skip);

        if (!admins.length) throw "No Admins Found";

        const info = admins.map((e) => {
            const { password, phone, ...info } = e._doc
            return info
        }
        )
        res
            .status(StatusCodes.OK)
            .json({ message: "success", data: info });
    }
    catch (error) {
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error })
    }
}


const deleteAdmin = async (req, res) => {
    const { id } = req.params
    try {
    
        const admin = await User.findOneAndDelete({ _id: id, role: "admin" });

        if (!admin) throw "INVALID admin ID";

        res
            .status(StatusCodes.OK)
            .json({ message: "deleted successfully" })

    }
    catch (error) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: error })
    }

}

const blockUser = async (req, res) => {
    const { id } = req.params
    try {

        const user = await User.findById(id);
        if (user) {
            user.isBlocked = true;
            await user.save();

            res
                .status(StatusCodes.OK)
                .json({ message: "user has been blocked" })

        }
        else throw "INVALID user ID"

    }
    catch (error) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: error })
    }

}

module.exports = {
    superAdminSignUp,
    addAdmin,
    deleteAdmin,
    getAllAdmins,
    blockUser
}