const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_KEY);
const { v4 } = require('uuid')
var mongoose_delete = require('mongoose-delete');
var jwt = require('jsonwebtoken');

const userSchema = new Schema({
    userName: String,
    email: {
        type: String,
        unique: true,
        index: true
    },
    password: String,
    phone: String,
    location: String,
    userImage: String,
    verified: { type: Boolean, default: false },
    resetToken: String,
    resetPasswordExpire: String,
    isBlocked: { type: Boolean, default: false },
    role: {
        type: String,
        enum: {
            values: ['user', 'admin', 'superAdmin'],
            message: '{VALUE} is not supported role',
        },
        default: 'user'
    },

}, {
    timestamps: true
})


userSchema.methods.getResetPasswordToken = async function () {
    const resetToken = v4().toString().replace(/-/g, '');
    this.resetPassword = await bcrypt.hash(resetToken, 7);
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}


userSchema.statics.generateToken = function (user) {
    let token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
    });
    return token;
}

userSchema.statics.verifyToken = function (token) {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
}

userSchema.statics.comparePassword = async function (oldPassword, newPassword) {
    let match = await bcrypt.compare(oldPassword, newPassword)
    return match;
}

userSchema.plugin(mongoose_delete,
    { deletedAt: true, overrideMethods: ['count', 'find', 'countDocuments', 'findOneAndUpdate', 'update'] });

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 7);
        // this.phone = cryptr.encrypt(this.phone);
        // console.log(cryptr.decrypt(this.phone))
        next();
    } catch (error) {
        throw new Error(error);
    }
});

userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("phone")) {
            return next();
        }
        // this.password = await bcrypt.hash(this.password, 7);
        this.phone = cryptr.encrypt(this.phone);
        // console.log(cryptr.decrypt(this.phone))
        next();
    } catch (error) {
        throw new Error(error);
    }
});


userSchema.pre('findOneAndUpdate', async function (next) {
    try {
        if (this._update.password) {
            const hashed = await bcrypt.hash(this._update.password, 7)
            this._update.password = hashed;
        }
        next();
    } catch (err) {
        return next(err);
    }
});



module.exports = userSchema;