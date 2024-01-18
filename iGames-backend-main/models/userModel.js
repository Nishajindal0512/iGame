const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address.");
            }
        },
    },
    password: { type: String, required: true, minLength: [6, "Password too short."] },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "game" }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "game" }],
});

// Hash plain text password before saving
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Verify password
userSchema.methods.isMatch = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
};

// Generate authentication token
userSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
