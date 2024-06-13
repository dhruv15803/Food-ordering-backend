import jwt from 'jsonwebtoken';
const generateAndSetAccessToken = (userId, res) => {
    const token = jwt.sign({
        "userId": userId,
    }, process.env.JWT_SECRET);
    res.cookie('accessToken', token, {
        httpOnly: true,
    });
};
export { generateAndSetAccessToken, };
