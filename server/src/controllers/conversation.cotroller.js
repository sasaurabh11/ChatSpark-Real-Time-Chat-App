
import { Conversation } from "../model/conversation.model.js"

export const newConversation = async (req, res) => {
    try {
          
        const senderId = req.body.senderId;
        const receverId = req.body.receverId;

        const exist = await Conversation.findOne({ members: {$all : [receverId, senderId]} });

        if(exist) {
            return res.status(200)
            .json('conversation already exist')
        }

        const newConversation = new Conversation({
            members: [senderId, receverId]
        })

        await newConversation.save()

        return res.status(200)
        .json('conversation saved successfully')

    } catch (error) {
        return res.status(500)
        .json('Error in creating new conversation', error.message)
    }
}

export const getconversations = async (req, res) => {
    try {
        const senderId = req.body.senderId;
        const receiverId = req.body.receiverId;

        let conversationobject =  await Conversation.findOne( {
            members: { $all: [senderId, receiverId]}
        })

        return res.status(200)
        .json(conversationobject)
        
    } catch (error) {
        return res.status(500)
        .json(error.message)
    }
}