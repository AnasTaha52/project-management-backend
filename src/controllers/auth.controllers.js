import { User } from "../models/user.models";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

/* 
take some data
validate the data
check in DB if user already exists
SAVED the new user (AT , RT , GT , sendmail)
userVerification => email
send response back to the request
*/

const registerUser = asyncHandler(async (req , res ) => {
    const {email , username , password , role} = req.body

    const existedUser =await User.findOne({
        $or: [{username} , {email}]
    })

    if(existedUser){
        throw new ApiError(409 , "User with email or username already exists" , []);
    }

    const user =  await User.create({
        email,
        password,
        username,
        isEmailVerified: false
    })
})