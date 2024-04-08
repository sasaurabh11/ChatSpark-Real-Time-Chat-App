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
    // console.log(users.given_name)
    !users.some(user => user.sub === userData.sub) && users.push({ ...userData, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.sub === userId);
}

io.on('connection', (socket) => {
    console.log(`user connected at ${port}`)

    //connect
    socket.on("addUsers", userData => {
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    })

    //send message
    socket.on('sendMessage', (data) => {
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
