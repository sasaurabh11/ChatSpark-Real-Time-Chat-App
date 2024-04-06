import React, { useContext, useEffect, useState } from 'react'
import ChatHeader from './ChatHeader'
import Messages from './Messages'

import { AccountContext } from '../../../ContextApi/AccountProvide'
import { getConversation } from '../../../Service/api'

function ChatUser() {
  const { person, account } = useContext(AccountContext)

  const [conversation, setConversation] = useState({})

  useEffect(() => {
    const getConversationDetails = async () => {
      let data = await getConversation({senderId : account.sub, receiverId : person.sub})
      // console.log(data)
      setConversation(data)
    }

    getConversationDetails()
  }, [person.sub])

  return (
    <>
      <ChatHeader person = {person} />
      <Messages person = {person} conversation={conversation}/>
    </>
  )
}

export default ChatUser