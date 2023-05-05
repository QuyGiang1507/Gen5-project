const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: 'string',
        required: true,
    },
    password: {
        type: 'string',
        required: true,
    },
    avatarUrl: {
        type: 'string',
    },
    name: {
        type: 'string',
    },
    gender: {
        type: 'string',
    },
    nationality: {
        type: 'string',
    },
    birthday: {
        type: 'date',
    },
    phone: {
        type: 'string',
    },
    role: {
        type: 'string',
        default: 'client'
    }
}, {
    timestamp: true,
});

const UserModel = new mongoose.model('User', UserSchema);

module.exports = UserModel;