
import { FriendRequest } from "../model/FrientRequest.model.js";
import { Friendship } from "../model/FriendShip.model.js";
import { Userlocal } from "../model/userLocal.model.js";
import mongoose from "mongoose";
import { Types } from "mongoose";
const { ObjectId } = Types;

export const sendfriendrequest = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
    });

    if (existingRequest) {
      return res.status(400)
      .json({ message: "Friend request already sent." });
    }

    const newRequest = new FriendRequest({
      sender: senderId,
      recipient: recipientId,
    });

    await newRequest.save();

    // Notify recipient (you'll implement this part with Socket.io)
    // Emit a socket event to notify recipient
    // socket.emit('friendRequestReceived', { senderId });

    res.status(200).json({ message: "Friend request sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getfriendRequest = async (req, res) => {
    try {
        const recipientId = req.params.requestId

        const friendRequests = await FriendRequest.find({ recipient: recipientId });

        const pendingRequests = friendRequests.filter(request => request.status === 'pending');

        const senderIds = pendingRequests.map(request => request.sender);

        const senders = await Userlocal.find({ _id: { $in: senderIds } });

        res.status(200)
        .json({
          message: 'request fetched successfully',
          requestData: senders
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'error in friendRequest' });
    }
}

export const acceptfriendrequest = async (req, res) => {
    try {
        // const { requestId, recipientId } = req.body;

        
        // const request = await FriendRequest.findOne({sender : requestId, recipient : recipientId});
        
        //   if (!request) {
        //     return res.status(404).json({ message: 'Friend request not found.' });
        //   }
        //   if (request.status !== 'pending') {
        //     return res.status(400).json({ message: 'Friend request already processed.' });
        //   }

        //   if (request.recipient.toString() !== recipientId) {
        //       return res.status(400).json({ message: 'Invalid recipient for this friend request.' });
        //   }
            
        //   request.status = 'accepted';
        //   await request.save();

        // //   const existfriendShip = await Friendship.findOne({ users: {$all: [request.sender, request.recipient]} }) 

        // //   if(existfriendShip) {
        // //     return res.status(200)
        // //     .json('FriendShip already exist')
        // // }
          
        //   const friendship = new Friendship({ users: [request.sender, request.recipient] });
        
        // await friendship.save();

        // res.status(200).json({ message: 'Friend request accepted successfully.' });

        const { requestId, recipientId } = req.body;

        const request = await FriendRequest.findOne({ sender: requestId, recipient: recipientId });
        
        if (!request) {
            return res.status(404).json({ message: 'Friend request not found.' });
        }
        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Friend request already processed.' });
        }

        if (request.recipient.toString() !== recipientId || request.sender.toString() !== requestId) {
            return res.status(400).json({ message: 'Invalid sender or recipient for this friend request.' });
        }
            
        request.status = 'accepted';
        await request.save();

        // Check if friendship already exists
        const existFriendship = await Friendship.findOne({ users: { $all: [request.sender, request.recipient] } });
        if (existFriendship) {
            return res.status(200).json({ message: 'Friendship already exists.' });
        }
          
        // Create a new friendship
        const friendship = new Friendship({ users: [request.sender, request.recipient] });
        await friendship.save();

        res.status(200).json({ message: 'Friend request accepted successfully.' });
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
};

export const getFriends = async (req, res) => {
  try {
      const { requestId } = req.query;

      const friendships = await Friendship.find({ 
        users: { $elemMatch: { $eq: requestId } }
      }).populate('users');
      
      if (friendships.length === 0) {
          return res.status(404).json({ message: 'No friendships found.' });
      }

      res.status(200).json({ message: 'Friendships found successfully.', friendships });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error in getFriends server' });
  }

}
