const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: {
        type: 'string',
        required: true,
    },
    iconUrl: {
        type: 'string',
        required: true,
    },
    sapo: {
        type: 'string',
        required: true,
    },
    content: {
        type: 'string',
        required: true,
    },
    properties: {
        type: 'array',
    },
    isDeleted: {
        type: 'boolean',
        default: false,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const NewsModel = mongoose.model('News', NewsSchema);

module.exports = NewsModel;