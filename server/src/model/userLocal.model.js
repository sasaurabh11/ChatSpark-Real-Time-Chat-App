import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        // avatar : {
        //     type : String, //cloudinary url
        //     required: true,
        // },
        // coverImg : {
        //     type : String,
        // },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        // refreshToken: {
        //     type: String
        // }
    },
    {
        timestamps: true
    }
)

//middlaware to hash password of user using bcrypt
UserSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10);
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

UserSchema.post("save", async function (doc, next) {
    try {
        // console.log("DOC", doc)

        //create transpoter for mail
        let transpoter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            auth : {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            }
        })

        // send mail
        let info = await transpoter.sendMail({
            from : "Saurabh",
            to : doc.email,
            subject : "Created new account from this email Your Document uploaded",
            html : `<h2>File uploaded</h2> <p>Your file uploaded on website<p>`
        })

        console.log(info)

        next()
    } catch (error) {
        console.error(error)
    }
})

export const User = mongoose.model("User", UserSchema)