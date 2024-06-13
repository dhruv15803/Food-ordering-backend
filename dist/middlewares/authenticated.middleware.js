import jwt from 'jsonwebtoken';
const authenticatedUser = (req, res, next) => {
    if (!req.cookies?.accessToken) {
        res.status(400).json({
            "success": false,
            "message": "no accessToken found for authenticated user"
        });
        return;
    }
    const decodedToken = jwt.verify(req.cookies?.accessToken, process.env.JWT_SECRET);
    const { userId } = decodedToken;
    req.userId = userId;
    next();
};
export { authenticatedUser };
