const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
userSchema.statics.validateAuthToken = function(token) {
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        return decoded;
    } catch (error) {
        return null;
    }
};
// Hash the password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Generate JWT token for the user
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, 'your_secret_key',{ expiresIn: '1d' });
    return token;
};


// Check if the provided password matches the stored password
userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;