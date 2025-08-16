
import { Conversation } from '../model/conversation.model.js';
import {Message} from '../model/message.model.js'

export const newMessage = async (data) => {
    const addMessage = new Message(data);
    await addMessage.save();

    console.log(data.translatedText)

    await Conversation.findByIdAndUpdate(
        data.conversationId,
        { message: data.translatedText || data.text }
    );

    return addMessage;
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