
import { FriendRequest } from "../model/FrientRequest.model.js";
import { Friendship } from "../model/FriendShip.model.js";
import { Userlocal } from "../model/userLocal.model.js";

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

        // console.log("recientp: ", recipientId)
        const friendRequests = await FriendRequest.find({ recipient: recipientId });


        const senderIds = friendRequests.map(request => request.sender);

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
        const { requestId } = req.body;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
          return res.status(404).json({ message: 'Friend request not found.' });
        }
        if (request.status !== 'pending') {
          return res.status(400).json({ message: 'Friend request already processed.' });
        }

        request.status = 'accepted';
        await request.save();

        const friendship = new Friendship({ users: [request.sender, request.recipient] });
        
        await friendship.save();

        res.status(200).json({ message: 'Friend request accepted successfully.' });
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
};
