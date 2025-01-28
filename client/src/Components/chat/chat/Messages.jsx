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
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          console.log("Notifications disabled by user.");
        }
      });
    }
  }, []);  

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

      // Show browser notification
      if (Notification.permission === "granted") {
        const senderName = person?.name || 'Unknown User';
        const notificationOptions = {
          body:
            incomingMessage && incomingMessage.text,
          icon: person?.profilePhoto || '/default-profile.png',
        };

        const notification = new Notification(
          `New message from ${senderName}`,
          notificationOptions
        );

        // Optional: Focus the browser window on notification click
        notification.onclick = () => {
          window.focus();
        };
      }
      
  }, [incomingMessage, conversation]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({transition : 'smooth'})
  })

  useEffect(() => {
    const getMessageDetails = async () => {
      let data = await getMessage(conversation._id)
      setMessages(data)
    }
    conversation._id && getMessageDetails();
  },[person._id, conversation?._id, newMessageFlag])

  const sendText = async (e) => {
    const code = e.keyCode || e.which;
    if(code === 13) {
      let massage = {}

    //   if(!file) {

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
              messages && messages.map((message, index) => (
                <div className='singlemessage' key={index} ref={scrollRef}>
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