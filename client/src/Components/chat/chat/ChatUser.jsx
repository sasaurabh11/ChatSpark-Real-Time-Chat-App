import React, { useContext, useEffect, useState } from 'react'
import ChatHeader from './ChatHeader'
import Messages from './Messages'

import { AccountContext } from '../../../ContextApi/AccountProvide'
import { getConversation } from '../../../Service/api'

function ChatUser() {
  const { person, account, localAccount } = useContext(AccountContext)

  const [conversation, setConversation] = useState({})

  useEffect(() => {
    const getConversationDetails = async () => {
        const recieveid = person?.sub || person?._id 
        const sendid = localAccount?._id || account?.sub

        let data = await getConversation({senderId : sendid, receiverId : recieveid})
        setConversation(data) 
    }

    getConversationDetails()
  }, [person.sub, person._id])

  return (
    <> 
      <ChatHeader person = {person} />
      <Messages person = {person} conversation={conversation}/>
    </>
  )
}

export default ChatUser