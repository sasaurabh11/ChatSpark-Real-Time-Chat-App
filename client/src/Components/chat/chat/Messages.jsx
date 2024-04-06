import React, { useContext, useState } from 'react'
import './Messages.css'
import Footer from './Footer'

import { AccountContext} from '../../../ContextApi/AccountProvide'

import {newMassage} from '../../../Service/api'

function Messages({person, conversation}) {

  const { account } = useContext(AccountContext)

  const [value, setValue] = useState('')

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
    }
  }

  return (
    <>
        <div className='component'>
            
        </div>
        <Footer
          sendText={sendText}
          setValue={setValue}
        />
    </>
  )
}

export default Messages