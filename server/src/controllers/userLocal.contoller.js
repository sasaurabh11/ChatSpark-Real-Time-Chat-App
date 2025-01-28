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

        
        const createdUser = await Userlocal.findById(userlocalcheck._id).select(
            "-password"
        )
        
        if(!createdUser) {
            return res.status(500)
            .json('something went wrong in Local user creation')
        }

        // const userData = {
        //     _id: userlocalcheck._id, // MongoDB _id
        //     name: userlocalcheck.name,
        //     email: userlocalcheck.email,
        //     profilePhoto: userlocalcheck.profilePhoto
        // };
    
        return res.status(201).json({
            message: 'User created successfully',
            user: createdUser
        })
    } catch (error) {
        return res.status(500)
        .json('error in signup local server')
    }

}

const loginUserLocal = async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email) {
            return res.status(400)
            .json('email is required')
        }

        const user = await Userlocal.findOne({ email: email })

        if(!user) {
            return res.status(400)
            .json('user not exist create new account')
        }

        const isValidPassword = await user.isPasswordCorrect(password)

        if(!isValidPassword) {
            throw new ApiError(401, "Invalid User Credentials")
        }

        // if(password !== user.password) {
        //     return res.status(401)
        //     .json('Invalid User credentials')
        // }

        // const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

        const loggedInUser = await Userlocal.findById(user._id).select("-password")

        // //frontend se koi modify nahi kar payega
        const options = {
            httpOnly : true,
            secure : true
        }

        // //yaha return me problem aa sakta hai
        return res
        .status(200)
        .json(
            {
                message : "user login successfully",
                user : loggedInUser
            }
        )
    } catch (error) {
        
    }
}

const getUserLocalController = async (req, res) => {
    try {
        const allUsers = await Userlocal.find({})
        
        return res.status(200)
        .json(allUsers)

    } catch (error) {
        console.error('Error occurred while getUser from database user:', error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export {signupLocal, loginUserLocal, getUserLocalController}