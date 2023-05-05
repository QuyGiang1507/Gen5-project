const mongoose = require('mongoose');

let ItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    productName: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less then 1.']
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
})
const CartSchema = new mongoose.Schema({
    items: [ItemSchema],
    subTotal: {
        default: 0,
        type: Number
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, {
    timestamps: true
})

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = CartModel;