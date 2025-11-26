const mongoose = require("mongoose");

const UserScheme = mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
    },
    passwordHash: String,
    role: {
        type: String,
        enum: ['admin', 'commander', 'logistics'],
        required: true,
    },
    baseId: {
        type:
            mongoose.Schema.Types.ObjectId,
        ref: 'Base',
    }
});

module.exports = mongoose.model('User', UserScheme);