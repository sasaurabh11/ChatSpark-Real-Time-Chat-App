
import { Conversation } from '../model/conversation.model.js';
import {Message} from '../model/message.model.js'

export const newMessage = async (req, res) => {
    try {
        let data = req.body;

        const addMessage = new Message(data)
        await addMessage.save()

        await Conversation.findByIdAndUpdate(req.body.conversationId, {message: req.body.text})

        return res.status(200)
        .json('Message has been sent successfully')

    } catch (error) {
        return res.status(500)
        .json(error.message)
    }
}   

export const getMessage = async (req, res) => { 
    try {
        // const messages = await Message.find({ conversationId: req.params.id})
        const messages = await Message.find({ conversationId: req.params.id }).populate('conversationId');
        return res.status(200)
        .json(messages) 
    } catch (error) {
        return res.status(500)
        .json(error.message)
    }
}