import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser";
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        // origin: process.env.url,
        origin: [process.env.url, 'https://chat-spark-app.vercel.app'],
    }, 
})

app.set("io", io);

app.use(cors({
    origin: [process.env.CORS_ORIGIN, 'https://chat-spark-app.vercel.app'], //here add cors for deployed link
    credentials: true
}))

//middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("Public"))
app.use(cookieParser()) 

//socket intialization
let users = [];

const addUser = (userData, socketId) => {
    // console.log("user in socket", userData);
    !users.some(user => (user.sub === userData.sub && user._id === userData._id)) && users.push({ ...userData, socketId });
    // console.log("users value ", users);
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    // console.log("users", users)
    return users.find(user => ((user.sub === userId) || (user._id === userId)));
}

io.on('connection', (socket) => {
    console.log(`user connected`)
    // console.log("users", users)

    //connect
    socket.on("addUsers", userData => {
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    })

    //send message
    socket.on('sendMessage', (data) => {
        // console.log(data.re/ceiverId)
        const user = getUser(data.receiverId);
        io.to(user.socketId).emit('getMessage', data)
    })

    //disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})

//route import
import adduser from './routes/user.router.js'

//User routes declaration
app.use("/api/v1/user", adduser)

app.get('/', (req, res) => {
    res.send("Landing page of home")
})

export { server, io }
