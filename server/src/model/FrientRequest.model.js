import { Schema } from "mongoose";
import mongoose from "mongoose";

const friendRequestSchema = new Schema(
    {
        sender: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        recipient: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        status: { 
            type: String, 
            enum: ['pending', 'accepted', 'declined'], default: 'pending' 
        }
    }
)

export const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema)