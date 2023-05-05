const CartModel = require('./cart');
const ProductModel = require('../product/product');

const addItemToCart = async (req, res) => {

    const { user } = req;

    const { productId } = req.body;

    const quantity = Number.parseInt(req.body.quantity);

    try {
        let cart = await CartModel.findOne({ createdBy: user._id });
        let productDetails = await ProductModel.findById(productId);

        if (!productDetails) {
            res.status(500).send({
                success: 0,
                data: null,
                message: err.message || 'Something went wrong',
            })
        }
        
        //--If Cart Exists ----
        if (cart) {
            //---- Check if index exists ----
            const indexFound = cart.items.findIndex(item => item.productId._id == productId);
            //------This removes an item from the the cart if the quantity is set to zero, We can use this method to remove an item from the list  -------
            if (indexFound !== -1 && quantity <= 0) {
                cart.items.splice(indexFound, 1);
                if (cart.items.length === 0) {
                    cart.subTotal = 0;
                } else {
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
            }
            //----------Check if product exist, just add the previous quantity with the new quantity and update the total price-------
            else if (indexFound !== -1 && cart.items[indexFound].quantity < productDetails.amount) {
                cart.items[indexFound].quantity = cart.items[indexFound].quantity + quantity;
                cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
                cart.items[indexFound].price = productDetails.price
                cart.items[indexFound].productName = productDetails.productName
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----Check if quantity is greater than 0 then add item to items array ----
            else if (quantity > 0 && quantity < productDetails.amount) {
                cart.items.push({
                    productId: productId,
                    quantity: quantity,
                    price: productDetails.price,
                    productName: productDetails.productName,
                    total: parseInt(productDetails.price * quantity)
                })
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            //----If quantity of price is 0 throw the error -------
            else {
                return res.status(400).send({
                    success: 0,
                    data: null,
                    message: err.message || 'Invalid request',
                })
            }
            
            let cartData = await cart.save();

            res.send({
                success: 1,
                data: cartData,
            })
        }
        //------------ Create a new cart and add the item to the cart ------------
        else {
            const cart = await CartModel.create({
                items: [{
                    productId: productId,
                    quantity: quantity,
                    productName: productDetails.productName,
                    total: parseInt(productDetails.price * quantity),
                    price: productDetails.price
                }],
                subTotal: parseInt(productDetails.price * quantity),
                createdBy: user._id
            });
            
            res.send({
                success: 1,
                data: cart,
            });
        }
    } catch (err) {
        res.status(400).send({
            success: 0,
            data: null,
            message: err.message || 'Something went wrong',
        })
    }
};

const getCart = async (req, res) => {

    const { user } = req;
    
    try {
        const cart = await CartModel.findOne({ createdBy: user._id });
        if (cart) {
            res.send({
                success: 1,
                data: cart,
            })
        } else {
            res.status(400).send({
                success: 0,
                data: null,
                message: err.message || 'Something went wrong',
            })
        }
    } catch (err) {
        res.status(400).send({
            success: 0,
            data: null,
            message: err.message || 'Something went wrong',
        })
    }
}

const updateCart = async (req, res) => {
    const { user } = req;

    const { productId } = req.body;

    const changeQuantity = Number.parseInt(req.body.changeQuantity);

    try {
        let cart = await CartModel.findOne({ createdBy: user._id });
        let productDetails = await ProductModel.findById(productId);
        
        if (!productDetails) {
            res.status(500).send({
                success: 0,
                data: null,
                message: 'Something went wrong',
            })
        }

        if (cart) {
            //---- Check if index exists ----
            const indexFound = cart.items.findIndex(item => item.productId._id == productId);
            //----------Check if product exist, just add the previous quantity with the new quantity and update the total price-------
            if (indexFound !== -1 && cart.items[indexFound].quantity < productDetails.amount) {
                cart.items[indexFound].quantity = cart.items[indexFound].quantity + changeQuantity;
                cart.items[indexFound].total = cart.items[indexFound].quantity * productDetails.price;
                cart.items[indexFound].price = productDetails.price
                cart.items[indexFound].productName = productDetails.productName
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }
            else {
                return res.status(400).send({
                    success: 0,
                    data: null,
                    message: err.message || 'Invalid request',
                })
            }
            
            let cartData = await cart.save();

            res.send({
                success: 1,
                data: cartData,
            })
        }
    } catch (err) {
        
        res.status(400).send({
            success: 0,
            data: null,
            message: err.message || 'Something went wrong',
        })
    }
}

const emptyCart = async (req, res) => {

    const { user } = req;

    try {
        const emptyCart = await CartModel.findOneAndUpdate(
            { createdBy: user._id },
            {
                items: [],
                subTotal: 0
            },
            { new: true },
        );

        res.send({
            success: 1,
            data: emptyCart,
        })
    } catch (err) {
        
        res.status(400).send({
            success: 0,
            data: null,
            message: err.message || 'Something went wrong',
        })
    }
}

const removeItemFromCart = async (req, res) => {
    const { user } = req;

    const { productId } = req.body;

    try {
        let cart = await CartModel.findOne({ createdBy: user._id });

        const indexFound = cart.items.findIndex(item => item.productId._id == productId);

        if (indexFound !== -1) {
            cart.items.splice(indexFound, 1);

            if (cart.items.length === 0) {
                cart.subTotal = 0;
            } else {
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
            }

            const removedCartData = cart;

            const removedCart = await CartModel.findOneAndUpdate(
                { createdBy: user._id },
                removedCartData,
                { new: true },
            )

            res.send({
                success: 1,
                data: removedCart,
            })
        } else {
            res.status(400).send({
                success: 0,
                data: null,
                message: 'Can not find product',
            })
        }
    } catch (err) {
        res.status(400).send({
            success: 0,
            data: null,
            message: err.message || 'Something went wrong',
        })
    }
}

const buyProduct = async (req, res) => {
    const { user } = req;
    
    try {
        let cart = await CartModel.findOne({ createdBy: user._id });


        if(cart) {
            const soldProducts = [];
            for (let i = 0; i < cart.items.length; i++) {
                const detailProduct = await ProductModel.findById(cart.items[i].productId)
                const soldProduct = await ProductModel.findOneAndUpdate(
                    { _id: cart.items[i].productId },
                    { amount: detailProduct.amount - cart.items[i].quantity },
                    { new: true },
                )

                soldProducts.push(soldProduct);
            }

            const emptyCart = await CartModel.findOneAndUpdate(
                { createdBy: user._id },
                {
                    items: [],
                    subTotal: 0
                },
                { new: true },
            );

            res.send({
                success: 1,
                data: [soldProducts, emptyCart],
            })
        } else {
            res.status(400).send({
                success: 0,
                data: null,
                message: 'Something went wrong',
            })
        }
    } catch (err) {
        res.status(400).send({
            success: 0,
            data: null,
            message: err.message || 'Something went wrong',
        })
    }
}

module.exports = {
    addItemToCart,
    getCart,
    updateCart,
    emptyCart,
    removeItemFromCart,
    buyProduct,
}