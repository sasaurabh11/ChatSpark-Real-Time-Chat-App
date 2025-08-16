import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { translateText } from './utills/translator.js';

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
    origin: [process.env.url, 'https://chat-spark-app.vercel.app'],
    // origin : process.env.CORS_ORIGIN,
    credentials: true
}))

//middlewares
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("Public"))
app.use(cookieParser())

//socket intialization
let users = [];
let rooms = new Map(); // roomId -> { socketId: userInfo }
let callSessions = new Map();

const getRoomParticipants = (roomId) => {
    const room = rooms.get(roomId);
    return room ? Object.keys(room) : [];
};

const addUser = (userData, socketId) => {
    !users.some(user => (user.sub === userData.sub && user._id === userData._id)) && users.push({ ...userData, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => ((user.sub === userId) || (user._id === userId)));
}

const cleanupRoom = (roomId) => {
    const room = rooms.get(roomId);
    if (room && Object.keys(room).length === 0) {
        rooms.delete(roomId);
        callSessions.delete(roomId);
        console.log(`🧹 Cleaned up empty room: ${roomId}`);
        return true;
    }
    return false;
};

io.on('connection', (socket) => {
    console.log(`user connected`)

    //connect
    socket.on("addUsers", userData => {
        addUser(userData, socket.id);
        io.emit("getUsers", users);
    })

    //send message
    socket.on('sendMessage', async (data) => {
        const sourceLang = data.selectedLang || 'en';
        const user = getUser(data.receiverId);

        let translatedText = data.text;
        const targetLang = user?.preferredLang || 'en';

        if (targetLang !== sourceLang) {
            translatedText = await translateText(data.text, sourceLang, targetLang);
        }

        const messageToDeliver = {
            ...data,
            text: data.text,
            translatedText,
            createdAt: Date.now(),
        };

        if (user?.socketId) {
            io.to(user.socketId).emit('getMessage', messageToDeliver);
        }

        setImmediate(async () => {
            try {
                await newMessage(messageToDeliver);
            } catch (err) {
                console.error("Error saving message:", err);
            }
        });
    });

    //disconnect
    // socket.on('disconnect', () => {
    //     console.log('user disconnected');
    //     removeUser(socket.id);
    //     io.emit('getUsers', users);
    // })

    // WebRTC: Room Management
    socket.on('webrtc:join-room', ({ roomId, user }) => {
        if (!roomId) {
            console.error("❌ No roomId provided for join-room");
            return;
        }

        console.log(`🚪 User ${user?.name || user?.id} joining room ${roomId}`);
        
        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {});
            callSessions.set(roomId, { participants: [], status: 'waiting', callStarter: null });
        }

        const room = rooms.get(roomId);
        const session = callSessions.get(roomId);
        
        // Add user to room
        room[socket.id] = { 
            userId: user?.id, 
            name: user?.name, 
            preferredLang: user?.preferredLang,
            joinedAt: Date.now(),
            streamReady: false // Track stream readiness
        };

        // Add to call session
        if (!session.participants.includes(socket.id)) {
            session.participants.push(socket.id);
        }

        // Join socket room for broadcasting
        socket.join(roomId);

        const participantCount = Object.keys(room).length;
        console.log(`📊 Room ${roomId} now has ${participantCount} participants`);

        // Get existing peers (excluding the joiner)
        const existingPeers = Object.keys(room)
            .filter(socketId => socketId !== socket.id)
            .map(socketId => ({
                socketId,
                user: room[socketId]
            }));

        // Tell the joiner about existing peers
        if (existingPeers.length > 0) {
            console.log(`📤 Sending ${existingPeers.length} existing peers to ${socket.id}`);
            socket.emit('webrtc:existing-peers', { 
                roomId, 
                peers: existingPeers 
            });
        } else {
            console.log(`👤 ${socket.id} is the first person in room ${roomId}`);
        }

        // Notify existing peers about the new joiner
        if (existingPeers.length > 0) {
            socket.to(roomId).emit('webrtc:user-joined', {
                roomId,
                socketId: socket.id,
                user: room[socket.id]
            });
            console.log(`📢 Notified ${existingPeers.length} peers about new joiner: ${socket.id}`);
        }

        // Update call session status
        if (participantCount >= 2) {
            session.status = 'active';
        }
    });

    // Handle stream readiness notification
    socket.on('webrtc:stream-ready', ({ roomId, socketId }) => {
        console.log(`🎥 Stream ready notification from ${socketId} in room ${roomId}`);
        
        const room = rooms.get(roomId);
        if (room && room[socketId]) {
            room[socketId].streamReady = true;
            
            // Notify all other participants in the room
            socket.to(roomId).emit('webrtc:stream-ready', {
                roomId,
                socketId
            });
            
            console.log(`📢 Broadcasted stream-ready for ${socketId} to room ${roomId}`);
        }
    });

    // Handle request for existing peers (for call starters)
    socket.on('webrtc:request-peers', ({ roomId }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        const existingPeers = Object.keys(room)
            .filter(socketId => socketId !== socket.id)
            .map(socketId => ({
                socketId,
                user: room[socketId]
            }));

        if (existingPeers.length > 0) {
            console.log(`🔄 Re-sending ${existingPeers.length} existing peers to call starter ${socket.id}`);
            socket.emit('webrtc:existing-peers', { 
                roomId, 
                peers: existingPeers 
            });
        }
    });

    // WebRTC: Signaling
    socket.on('webrtc:offer', ({ to, from, roomId, description }) => {
        if (!to || !from || !description) {
            console.error("❌ Invalid offer parameters");
            return;
        }
        console.log(`📞 Relaying offer: ${from} -> ${to} (room: ${roomId})`);
        io.to(to).emit('webrtc:offer', { from, roomId, description });
    });

    socket.on('webrtc:answer', ({ to, from, roomId, description }) => {
        if (!to || !from || !description) {
            console.error("❌ Invalid answer parameters");
            return;
        }
        console.log(`✅ Relaying answer: ${from} -> ${to} (room: ${roomId})`);
        io.to(to).emit('webrtc:answer', { from, roomId, description });
    });

    socket.on('webrtc:ice-candidate', ({ to, from, candidate }) => {
        if (!to || !from || !candidate) {
            console.error("❌ Invalid ICE candidate parameters");
            return;
        }
        console.log(`🧊 Relaying ICE candidate: ${from} -> ${to}`);
        io.to(to).emit('webrtc:ice-candidate', { from, candidate });
    });

    // WebRTC: Call Lifecycle
    socket.on('webrtc:start-call', ({ roomId, fromUser }) => {
        console.log(`🎥 Starting call in room ${roomId} by ${fromUser?.name}`);
        
        const room = rooms.get(roomId);
        if (!room) {
            console.error(`❌ Room ${roomId} not found for start-call`);
            return;
        }

        const session = callSessions.get(roomId);
        if (session) {
            session.status = 'active';
            session.callStarter = socket.id; // Mark who started the call
        }

        // Notify all other participants in the room about incoming call
        const otherParticipants = Object.keys(room).filter(id => id !== socket.id);
        otherParticipants.forEach((participantId) => {
            io.to(participantId).emit('webrtc:incoming-call', { 
                roomId, 
                fromUser, 
                callerSocketId: socket.id 
            });
        });
        
        console.log(`📱 Notified ${otherParticipants.length} participants about incoming call from ${socket.id}`);
        
        // Give more time for the call starter to be ready, then trigger peer connections
        setTimeout(() => {
            const currentRoom = rooms.get(roomId);
            if (currentRoom && currentRoom[socket.id]) {
                const peersForStarter = Object.keys(currentRoom)
                    .filter(id => id !== socket.id)
                    .map(socketId => ({
                        socketId,
                        user: currentRoom[socketId]
                    }));
                
                if (peersForStarter.length > 0) {
                    console.log(`🔄 Triggering peer connections for call starter ${socket.id}`);
                    socket.emit('webrtc:existing-peers', { 
                        roomId, 
                        peers: peersForStarter 
                    });
                }
            }
        }, 2000); // Increased delay
    });

    socket.on('webrtc:end-call', ({ roomId }) => {
        console.log(`📞 Ending call in room ${roomId}`);
        
        const room = rooms.get(roomId);
        if (!room) return;

        const session = callSessions.get(roomId);
        if (session) {
            session.status = 'ended';
            session.callStarter = null;
        }

        // Reset stream ready status for all participants
        Object.keys(room).forEach(socketId => {
            if (room[socketId]) {
                room[socketId].streamReady = false;
            }
        });

        // Notify all other participants that call has ended
        const otherParticipants = Object.keys(room).filter(id => id !== socket.id);
        otherParticipants.forEach((participantId) => {
            io.to(participantId).emit('webrtc:call-ended', { roomId });
        });
        
        console.log(`🔚 Notified ${otherParticipants.length} participants that call ended`);
    });

    socket.on('webrtc:leave-room', ({ roomId }) => {
        console.log(`🚪 User ${socket.id} leaving room ${roomId}`);
        
        const room = rooms.get(roomId);
        if (!room || !room[socket.id]) {
            console.log(`⚠️ User ${socket.id} not found in room ${roomId}`);
            return;
        }

        const userInfo = room[socket.id];
        delete room[socket.id];
        socket.leave(roomId);

        // Update call session
        const session = callSessions.get(roomId);
        if (session) {
            session.participants = session.participants.filter(id => id !== socket.id);
            if (session.callStarter === socket.id) {
                session.callStarter = null;
            }
            if (session.participants.length < 2) {
                session.status = 'waiting';
            }
        }

        // Notify remaining participants
        const remainingParticipants = Object.keys(room);
        if (remainingParticipants.length > 0) {
            socket.to(roomId).emit('webrtc:user-left', { 
                roomId, 
                socketId: socket.id, 
                user: userInfo 
            });
            console.log(`📢 Notified ${remainingParticipants.length} remaining participants that ${socket.id} left`);
        }

        // Clean up empty room
        cleanupRoom(roomId);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.id}`);
        
        // Remove from users list
        removeUser(socket.id);
        io.emit('getUsers', users);

        // Handle WebRTC room cleanup
        const roomsToCleanup = [];
        
        for (const [roomId, room] of rooms.entries()) {
            if (room[socket.id]) {
                const userInfo = room[socket.id];
                delete room[socket.id];
                
                // Update call session
                const session = callSessions.get(roomId);
                if (session) {
                    session.participants = session.participants.filter(id => id !== socket.id);
                    if (session.callStarter === socket.id) {
                        session.callStarter = null;
                    }
                    if (session.participants.length < 2) {
                        session.status = 'waiting';
                    }
                }
                
                // Notify other participants in the room
                const remainingParticipants = Object.keys(room);
                remainingParticipants.forEach((participantId) => {
                    io.to(participantId).emit('webrtc:user-left', { 
                        roomId, 
                        socketId: socket.id, 
                        user: userInfo 
                    });
                });
                
                console.log(`📢 Notified ${remainingParticipants.length} participants about disconnect in room ${roomId}`);
                
                // Mark room for cleanup check
                roomsToCleanup.push(roomId);
            }
        }

        // Clean up empty rooms
        roomsToCleanup.forEach(roomId => cleanupRoom(roomId));
    });

    // Health check for specific socket
    socket.on('ping', () => {
        socket.emit('pong', { 
            timestamp: Date.now(),
            socketId: socket.id
        });
    });

})

//route import
import adduser from './routes/user.router.js'
import { newMessage } from './controllers/message.controller.js';

//User routes declaration
app.use("/api/v1/user", adduser)

app.get('/', (req, res) => {
    res.send("Landing page of home")
})

export { server, io }
