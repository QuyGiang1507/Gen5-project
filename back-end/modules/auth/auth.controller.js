const bcrypt = require('bcryptjs');
const UserModel = require('./user');
const tokenProvider = require('../../common/tokenProvider');
const HttpError = require('../../common/httpError');

const signUp = async (req, res, next) => {
    const { username, password } = req.body;

    const existedUser = await UserModel.findOne({ username });
    
    if (existedUser) {
        throw new HttpError('Signup failed, username already existed', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({ username, password: hashPassword });

    const token = tokenProvider.sign(newUser._id);

    res.send({
        success: 1,
        data: {
            _id: newUser._id,
            username: newUser.username,
            token,
        },
    });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    const existedUser = await UserModel.findOne({ username });

    if (!existedUser) {
        throw new HttpError('Signin failed, username dont exist', 400);
    }

    const hashPassword = existedUser.password;

    const matchedPassword = await bcrypt.compare(password, hashPassword);

    if (!matchedPassword) {
        throw new HttpError('Signin failed, password not correct', 400);
    }

    const token = tokenProvider.sign(existedUser._id);

    res.send({
        success: 1,
        data: {
            _id: existedUser._id,
            username: existedUser.username,
            token,
        },
    });
};

const getUserInfo = async (req, res) => {
    const { user } = req;
    const userInfo = user ? user : null;

    res.send({ success: 1, data: userInfo });
};

const verify = (req, res) => {
    const { user } = req;

    res.send({
        success: 1, 
        data: user,
    })
}

const updateInfo = async (req, res) => {
    const { user } = req;
    const userId = user._id.toString();

    const updateInfo = req.body;

    const updatedUser = await UserModel.findOneAndUpdate (
        {_id: userId},
        updateInfo,
        { new: true },
    )

    res.send({
        success: 1,
        data: updatedUser,
    });
}

const updatePassword = async (req, res) => {
    const { user } = req;
    const userId = user._id.toString();
    
    const { updatePassword } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(updatePassword, salt);
    
    const updatedUser = await UserModel.findOneAndUpdate (
        { _id: userId },
        { password: hashPassword },
        { new: true },
    )

    const token = tokenProvider.sign(updatedUser._id);

    res.send({
        success: 1,
        data: updatedUser,
        token,
    });
}

module.exports = {
    signUp,
    login,
    getUserInfo,
    verify,
    updateInfo,
    updatePassword,
};