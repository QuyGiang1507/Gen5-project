const ProductModel = require('./product');

const getProducts = async (req, res) => {
    try {
        const {
            keyword,
            createdBy,
            property,
            tag,
            skip,
            limit,
            sortField,
            sortDirection,
            expStart,
            expEnd,
        } = req.query;

        const { user } = req;
        
        const createdByFilter = createdBy ? { createdBy } : {};
        const keywordFilter = keyword ?
            {
                $or: [
                    { productName: { $regex: new RegExp(`${keyword}`, 'i') } },
                    { description: { $regex: new RegExp(`${keyword}`, 'i') } },
                ]
            } : {};

        const propertyFilter = property ? { properties: property } : {};

        const tagFilter = tag ? { tags: tag } : {};
        
        const expFilter = expStart && expEnd ? { exp: { $gte: expStart, $lte: expEnd } } : {};

        const filter = {
            ...createdByFilter,
            ...keywordFilter,
            ...propertyFilter,
            ...tagFilter,
            ...expFilter,
            isDeleted: false,
        };

        const pagination = {
            skip: skip ? Number(skip) : 0,
            limit: limit ? Number(limit) : 10,
        }

        let sortParams = {}
        if(sortField && sortDirection) {
            sortParams[sortField] = sortDirection === 'desc' ? -1 : 1;
        } else {
            sortParams.createdAt = -1;
        }

        const [products, totalProducts] = await Promise.all([
            ProductModel
                .find(filter)
                .populate('createdBy', '-password -gender -nationality -birthday -phone -__v')
                .sort(sortParams)
                .skip(pagination.skip)
                .limit(pagination.limit),
            ProductModel.find(filter).countDocuments()
        ]);

        const enhanceUsernameProducts = products.map(product => {
            const cloneProduct = JSON.parse(JSON.stringify(product));
            
            return {
              ...cloneProduct,
              createdUserName: product.createdBy.name ? product.createdBy.name : product.createdBy.username,
              createdBy: product.createdBy ? product.createdBy._id : "",
            }
          })
        
        res.send({
            success: 1,
            data: {
                data: enhanceUsernameProducts,
                total: totalProducts,
            },
        });
    } catch (err) {
        res.status(400).send({
            success: 0,
            data: null,
            message: err.message || 'Something went wrong',
        });
    }
};

const getProduct = async (req, res) => {
    const { productId } = req.params;

    const foundProduct = await ProductModel.findById(productId);

    res.send({
        success: 1,
        data: foundProduct,
    });
};

const createProduct = async (req, res) => {
    const { user } = req;

    const { productName, iconUrl, exp, code, price, amount, description, uses, guide, termsAndConditions, properties, tags } = req.body;
    const newProduct = await ProductModel.create({
        productName,
        iconUrl,
        exp,
        code,
        price,
        amount,
        description,
        uses,
        guide,
        termsAndConditions,
        properties,
        tags,
        isDeleted: false,
        createdBy: user._id,
    });

    res.send({
        success: 1,
        data: newProduct,
    });
};

const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { user } = req;
    const userId = user._id.toString();

    const updateProductData = req.body;

    const updatedProduct = await ProductModel.findOneAndUpdate(
        { $and: [
            {_id: productId,},
            {createdBy: userId}
        ] },
        updateProductData,
        { new: true },
    );

    if (!updatedProduct) {
        throw new Error('This product is not yours');
    }

    res.send({
        success: 1,
        data: updatedProduct,
    });
};

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { user } = req;
        const userId = user._id.toString();

        const deletedProduct = await ProductModel.findOneAndUpdate(
            { $and: [
                {_id: productId,},
                {createdBy: userId}
            ] },
            { isDeleted: true },
            { new: true },
        );

        if (!deletedProduct) {
            throw new Error('This product is not yours');
        }

        res.send({
            success: 1,
            data: deletedProduct,
        });
    } catch (err) {
        res.status(400).send({
            success: 0,
            data: null,
            message: "This product is not yours",
        });
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
}