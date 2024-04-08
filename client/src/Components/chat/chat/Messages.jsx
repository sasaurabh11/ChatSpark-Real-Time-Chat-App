import React, { useContext, useEffect, useState } from 'react'
import './Messages.css'
import Footer from './Footer'

import { AccountContext} from '../../../ContextApi/AccountProvide'

import {newMassage} from '../../../Service/api'
import { getMessage } from '../../../Service/api'

import MessageSingle from './MessageSingle'

function Messages({person, conversation}) {

  const { account } = useContext(AccountContext)

  const [value, setValue] = useState('')
  const [messages, setMessages] = useState([])
  const [newMessageFlag, setNewMessageFlage] = useState(false)

  useEffect(() => {
    const getMessageDetails = async () => {
      let data = await getMessage(conversation._id)
      // console.log(data)
      setMessages(data)
    }
    conversation._id && getMessageDetails();
  },[person._id, conversation._id, newMessageFlag])

  const sendText =async (e) => {
    const code = e.keyCode || e.which;
    if(code === 13) {
      let massage = {
        senderId: account.sub,
        receiverId: person.sub,
        conversationId: conversation._id,
        type: 'text',
        text: value
      }

      console.log(massage)

      await newMassage(massage)

      setValue('')
      setNewMessageFlage(prev => !prev)
    }
  }

  return (
    <>
        <div className='component'>
            {
               messages && messages.map(message => (
                  <div className='singlemessage'>
                    <MessageSingle message={message} />
                  </div>
               ))
            }
        </div>
        <Footer
          sendText={sendText}
          setValue={setValue}
          value={value}
        />
    </>
  )
}

export default Messages