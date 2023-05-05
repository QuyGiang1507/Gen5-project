const NewsModel = require('./news');

const getAllNews = async (req, res) => {
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
        } = req.query;

        const { user } = req;
        
        const createdByFilter = createdBy ? { createdBy } : {};
        const keywordFilter = keyword ?
            {
                $or: [
                    { title: { $regex: new RegExp(`${decodeURI(keyword)}`, 'i') } },
                    { sapo: { $regex: new RegExp(`${decodeURI(keyword)}`, 'i') } },
                    { content: { $regex: new RegExp(`${decodeURI(keyword)}`, 'i') } },
                ]
            } : {};

        const propertyFilter = property ? { properties: property } : {};

        const tagFilter = tag ? { tags: tag } : {};

        const filter = {
            ...createdByFilter,
            ...keywordFilter,
            ...propertyFilter,
            ...tagFilter,
            isDeleted: false,
        };
        
        const pagination = {
            skip: skip ? Number(skip) : 0,
            limit: limit ? Number(limit) : 10,
        }

        let sortParams = {}
        if(sortField && sortDirection) {
            sortParams[sortField] = sortDirection === 'desc' ? -1 : 1;
        }
        
        const [allNews, totalNews] = await Promise.all([
            NewsModel
                .find(filter)
                .populate('createdBy', '-password -__v')
                .sort(sortParams)
                .skip(pagination.skip)
                .limit(pagination.limit),
            NewsModel.find(filter).countDocuments()
        ]);
        
        const enhanceUsernameNews = allNews.map(news => {
            const cloneNews = JSON.parse(JSON.stringify(news));
            
            return {
              ...cloneNews,
              createdUserName: news.createdBy.name ? news.createdBy.name : news.createdBy.username,
              createdBy: news.createdBy ? news.createdBy._id : "",
            }
        })
        res.send({
            success: 1,
            data: {
                data: enhanceUsernameNews,
                total: totalNews,
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

const getNews = async (req, res) => {
    const { newsId } = req.params;

    const foundNews = await NewsModel.findById(newsId);

    res.send({
        success: 1,
        data: foundNews,
    });
};

const createNews = async (req, res) => {
    const { user } = req;

    const { title, iconUrl, sapo, content, properties } = req.body;
    const newNews = await NewsModel.create({
        title,
        iconUrl,
        sapo,
        content,
        properties,
        isDeleted: false,
        createdBy: user._id,
    });

    res.send({
        success: 1,
        data: newNews,
    });
};

const updateNews = async (req, res) => {
    const { newsId } = req.params;
    const { user } = req;
    const userId = user._id.toString();

    const updateNewsData = req.body;

    const updatedNews = await NewsModel.findOneAndUpdate(
        { $and: [
            {_id: newsId,},
            {createdBy: userId}
        ] },
        updateNewsData,
        { new: true },
    );

    if (!updatedNews) {
        throw new Error('This news is not yours');
    }

    res.send({
        success: 1,
        data: updatedNews,
    });
};

const deleteNews = async (req, res) => {
    try {
        const { newsId } = req.params;
        const { user } = req;
        const userId = user._id.toString();

        const deletedNews = await NewsModel.findOneAndUpdate(
            { $and: [
                {_id: newsId,},
                {createdBy: userId}
            ] },
            { isDeleted: true },
            { new: true },
        );

        if (!deletedNews) {
            throw new Error('This news is not yours');
        }

        res.send({
            success: 1,
            data: deletedNews,
        });
    } catch (err) {
        res.status(400).send({
            success: 0,
            data: null,
            message: "This news is not yours",
        });
    }
};

module.exports = {
    getAllNews,
    getNews,
    createNews,
    updateNews,
    deleteNews,
}