import React, { useContext, useEffect, useState, useRef } from 'react'
import './Messages.css'
import Footer from './Footer'

import { AccountContext} from '../../../ContextApi/AccountProvide'

import {newMassage} from '../../../Service/api'
import { getMessage } from '../../../Service/api'

import MessageSingle from './MessageSingle'

function Messages({person, conversation}) {

  const { account, localAccount, socket, newMessageFlag, setNewMessageFlage } = useContext(AccountContext)

  const [value, setValue] = useState('')
  const [messages, setMessages] = useState([])
  const [image, setImage] = useState('')
  const [incomingMessage, setIncomingMessage] = useState(null)

  const [file, setFile] = useState(false)

  const scrollRef = useRef()

  useEffect(() => { 
    socket.current.on('getMessage', data => {
      setIncomingMessage({
        ...data,
        createdAt: Date.now()
      })
    })
  })

  useEffect(() => {
      incomingMessage && conversation?.members?.includes(incomingMessage.senderId) && 
          setMessages((prev) => [...prev, incomingMessage]);
      
  }, [incomingMessage, conversation]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({transition : 'smooth'})
  })

  useEffect(() => {
    const getMessageDetails = async () => {
      let data = await getMessage(conversation._id)
      // console.log(data)
      setMessages(data)
    }
    conversation._id && getMessageDetails();
  },[person._id, conversation?._id, newMessageFlag])

  const sendText = async (e) => {
    const code = e.keyCode || e.which;
    if(code === 13) {
      let massage = {}

    //   if(!file) {

    //     console.log(account)

    //     const accountValue = account?.sub || account?._id
    //     const personvalue = person?.sub || person?._id

    //   //   massage = {
    //   //     senderId: account.sub,
    //   //     receiverId: person.sub,
    //   //     conversationId: conversation._id,
    //   //     type: 'text',
    //   //     text: value
    //   //   }
    //   // } else {
    //   //   massage = {
    //   //     senderId: account.sub,
    //   //     receiverId: person.sub,
    //   //     conversationId: conversation._id,
    //   //     type: 'file',
    //   //     text: image
    //   //   }
    //   // }

    //   massage = {
    //     senderId: accountValue,
    //     receiverId: personvalue,
    //     conversationId: conversation._id,
    //     type: 'text',
    //     text: value
    //   }
    // } else {
    //   massage = {
    //     senderId: accountValue,
    //     receiverId: personvalue,
    //     conversationId: conversation._id,
    //     type: 'file',
    //     text: image
    //   }
    // }

      if (!file) {
        // console.log("account", account);
        // console.log( "local", localAccount);

        const accountValue = account?.sub || (localAccount && localAccount._id);
        const personValue = person?.sub || (person && person._id);

        massage = {
          senderId: accountValue,
          receiverId: personValue,
          conversationId: conversation._id,
          type: 'text',
          text: value
        };
      } else {
        massage = {
          senderId: accountValue,
          receiverId: personValue,
          conversationId: conversation._id,
          type: 'file',
          text: image
        };
      }

      console.log(massage)

      socket.current.emit('sendMessage', massage) 

      await newMassage(massage)

      setValue('')
      setFile('')
      setImage('') 
      setNewMessageFlage(prev => !prev)
    }
  }

  return (
    <>
        <div className='component'>
            {
               messages && messages.map(message => (
                  <div className='singlemessage' ref={scrollRef}>
                    <MessageSingle message={message} />
                  </div>
               ))
            }
        </div>

        <Footer
          sendText={sendText}
          setValue={setValue}
          value={value}
          setImage={setImage}
        />
    </>
  )
}

export default Messages