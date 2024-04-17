import {Server } from 'socket.io'
import dotenv from 'dotenv'

dotenv.config({
    path: '.env'
})

const port = process.env.PORT || 4000

const io = new Server(port, {
    cors: {
        origin: process.env.url,
    }, 
})

let users = [];

const addUser = (userData, socketId) => {
    // console.log("user in socket", userData)
    // !users.some(user => ((user.sub === userData.sub) || (user._id === userData._id))) && users.push({ ...userData, socketId });
    !users.some(user => ((user.sub === userData.sub) || (user._id === userData._id))) && users.push({ ...userData, socketId });
    console.log("users value ", users)
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    // console.log("users", users)
    return users.find(user => ((user.sub === userId) || (user._id === userId)));
}

io.on('connection', (socket) => {
    console.log(`user connected at ${port}`)
    // console.log("users", users)

    //connect
    socket.on("addUsers", userData => {
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    })

    //send message
    socket.on('sendMessage', (data) => {
        console.log(data.receiverId)
        const user = getUser(data.receiverId);
        console.log(user)
        io.to(user.socketId).emit('getMessage', data)
    })

    //disconnect
    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})
