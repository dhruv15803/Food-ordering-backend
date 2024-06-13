import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';


declare global {
    namespace Express {
        interface Request {
            userId?:string;
        }
    }
}


const authenticatedUser = (req:Request,res:Response,next:NextFunction) => {
    if(!req.cookies?.accessToken) {
        res.status(400).json({
            "success":false,
            "message":"no accessToken found for authenticated user"
        })
        return;
    }
    const decodedToken = jwt.verify(req.cookies?.accessToken,process.env.JWT_SECRET as string);
    const {userId} = decodedToken as JwtPayload;
    req.userId=userId;
    next();
}

export {
    authenticatedUser
}