import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateAndSetAccessToken } from "../utils/accessToken.util.js";

const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      firstName,
      lastName,
      password,
    }: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    } = req.body;
    const inputs = [email, firstName, lastName, password];

    if(req.cookies?.accessToken) {
        res.status(400).json({
            "success":false,
            "message":"user already logged in"
        })
        return;
    }
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].trim() === "") {
        res.status(400).json({
          success: false,
          message: "Please enter all required fields while registering",
        });
        return;
      }
    }
    // checking if a user exists with this email.
    const isUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (isUser) {
      res.status(400).json({
        success: false,
        message: "user already exists with this email",
      });
      return;
    }

    let isAdmin = false;
    // checking if admin or not
    if(email.trim().toLowerCase()===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD) {
      isAdmin = true;
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      password: hashedPassword,
      isAdmin:isAdmin,
    });
    // creating accessToken and generating a cookie.
    generateAndSetAccessToken(newUser._id, res);
    res.status(201).json({
      success: true,
      message: "successfully registered user",
      newUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req:Request,res:Response) => {
  try {
    const {email,password}:{email:string;password:string} = req.body;
    if(req.cookies?.accessToken) {
      res.status(400).json({
        "success":false,
        "message":"user already logged in"
      })
      return;
    }
    if(email.trim()==="" || password.trim()==="") {
      res.status(400).json({
        "success":false,
        "message":"please enter all fields"
      })
      return;
    }
    // check is user exists with the email
    const user = await User.findOne({email:email.trim().toLowerCase()});
    if(!user) {
      res.status(400).json({
        "success":false,
        "message":"incorrect email or password"
      })
      return;
    }
    // check password
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect) {
      res.status(400).json({
        "success":false,
        "message":"incorrect email or password"
      })
      return;
    }
    generateAndSetAccessToken(user._id,res);
    res.status(200).json({
      "success":true,
      "message":"successfully logged in",
      user,
    })
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = (req:Request,res:Response) => {
  if(!req.cookies?.accessToken) {
    res.status(400).json({
      "sucess":false,
      "message":"no accessToken found"
    })
    return;
  }
  res.clearCookie('accessToken',{
    httpOnly:true,
    secure:true,
    sameSite:"none"
  }).json({
    "success":true,
    "message":"successfully logged out"
  })
};

const getLoggedInUser = async (req:Request,res:Response) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({_id:userId});
    if(!user) {
      res.status(400).json({
        "success":false,
        "message":"invalid user id"
      })
      return;
    }
    res.status(200).json({
      "success":true,
      user,
    })
  } catch (error) {
    console.log(error);
  }
}

export { registerUser, loginUser, logoutUser,getLoggedInUser};
