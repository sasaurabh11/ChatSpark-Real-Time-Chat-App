import mongoose from "mongoose";
import { Schema } from "mongoose";

const FriendshipSchema = new mongoose.Schema({
    users: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Userlocal' 
    }]
});

export const Friendship = mongoose.model("Friendship", FriendshipSchema)