import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

//middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("Public"))
app.use(cookieParser()) 

//route import
import adduser from './routes/user.router.js'

//User routes declaration
app.use("/api/v1/user", adduser)

app.get('/', (req, res) => {
    res.send("Landing page of home")
})

export { app }

app.js