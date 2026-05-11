import {ApiResponse} from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"

/*
const healthCheck = async (req , res, next) => {
    try {
        const user = await getUserFromDB()
        // Db may throw error , DB always is in an another continent it will take some time. So for this we have to put an await
        res
          .status(200)
          .json(new ApiResponse(200 , {message: "Server is running"}))
    } catch (error) {
        next(err)
        // next is express's nuilt-in error handler. 
    }
}
*/




const healthCheck = asyncHandler(async (req , res) => {
    res.status(200).json(new ApiResponse (200 , {message: "Server is running"}))
})
export {healthCheck}