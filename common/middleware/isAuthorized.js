const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const User = require('../../src/users/Model/userModel');
const rbac = require('../rbac/rbac');
module.exports = (endPoint) => {
    return async (req, res, next) => {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
            try {
                var decoded = jwt.verify(token, process.env.SECRET_KEY);

                const found = await User.findById(decoded._id);
                if (found) {
                    const isAllowed = await rbac.can(found.role, endPoint);
                    if (isAllowed) {
                        req.user = found;
                        next();
                    }
                    else throw "UNAUTHORIZED"
                }
                else throw "UNAUTHORIZED"

            }
            catch (err) {
                if (err = "UNAUTHORIZED") {
                    
                    res
                        .status(StatusCodes.UNAUTHORIZED)
                        .json({ message: "UNAUTHORIZED" })
                }
                else {
                    res.
                        status(StatusCodes.INTERNAL_SERVER_ERROR).
                        json({ message: "error", err })
                }

            }

        }
    }
}