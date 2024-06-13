import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

const generateAndSetAccessToken = (userId:Types.ObjectId,res:Response) => {
    const token = jwt.sign({
        "userId":userId,
    },process.env.JWT_SECRET as string);
    res.cookie('accessToken',token,{
        httpOnly:true,
    })
}

export {
    generateAndSetAccessToken,
}