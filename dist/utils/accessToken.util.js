import jwt from 'jsonwebtoken';
const generateAndSetAccessToken = (userId, res) => {
    const token = jwt.sign({
        "userId": userId,
    }, process.env.JWT_SECRET);
    res.cookie('accessToken', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: true,
        sameSite: 'none'
    });
};
export { generateAndSetAccessToken, };
