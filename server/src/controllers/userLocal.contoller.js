import { Userlocal } from "../model/userLocal.model.js"
import { uploadOnCloudinary } from "../utills/cloudinary.js"

const signupLocal = async (req, res) => {    
    try {
        // get user details from frontend
        // validation - empty or not
        // check if user already exist: email, username
        // upload to cloudinary
        // create userObject - create Entry in database
        // remove password and refresh token field from response
        // check for use creation
        // return res
        
        // const {name, email, password, profilePhoto} = req.body
        const {name, email, password} = req.body
    
        // if(name === "") {
        //     return res.status(500)
        //     .json('name is Required')
        // }
    
        if([name, email, password].some((field) => field?.trim() === "")) {
            return res.status(500)
            .json('All Information is Required')
        }
    
        const existedUser = await Userlocal.findOne({ email: email })

        if(existedUser) {
            return res.status(500)
            .json("user already exists")
        }

    
        const profilelocalPath = req.file?.path;

        const profilephoto =  await uploadOnCloudinary(profilelocalPath)
    
        if(!profilephoto) {
            res.status(200)
            .json("warning : profilePhoto is not uploaded on cloudinary")
        }
    
        const userlocalcheck = await Userlocal.create({
            name,
            email,
            password,
            profilePhoto : profilephoto?.url || ""
        })
        
        // const createdUser = await User.findById(userlocalcheck._id).select(
        //     "-password"
        // )
    
    
        // if(!createdUser) {
        //     return res.status(500)
        //     .json('something went wrong in Local user creation')
        // }
    
        return res.status(201).json(
            'user created successfully'
        )
    } catch (error) {
        return res.status(500)
        .json('error in signup local')
    }

}

const getuserlocal = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

export {signupLocal}