const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    productName: {
        type: 'string',
        required: true,
    },
    iconUrl: {
        type: 'string',
        required: true,
    },
    exp: {
        type: 'date',
        required: true,
    },
    code: {
        type: 'string',
        required: true,
    },
    price: {
        type: 'number',
        required: true,
    },
    amount: {
        type: 'number',
        required: true,
    },
    description: {
        type: 'string',
    },
    uses: {
        type: 'string',
    },
    guide: {
        type: 'string',
    },
    termsAndConditions: {
        type: 'string',
    },
    properties: {
        type: 'array',
    },
    tags: {
        type: 'array',
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    isDeleted: {
        type: 'boolean',
        default: false,
    }
}, {
    timestamps: true,
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;