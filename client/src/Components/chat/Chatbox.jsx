import {Dialog} from '@mui/material';
import Menu from './menu/Menu';
import Emptychat from './chat/Emptychat';
import './Chatbox.css'
import ChatUser from './chat/ChatUser';
import { useContext } from 'react';
import { AccountContext } from '../../ContextApi/AccountProvide';

const dialogStyle = {
    height : '95%',
    // marginTop : '3rem',
    width : '100%',
    margin : '20px',
    maxWidth: '100%',
    maxHeight: '100%',
    boxShadow: 'none',
    overflow: 'hidden',
    // backgroundColor: 'aqua'
}

function Chatbox() {
  const {person} = useContext(AccountContext)

  return (
    // <>
    <Dialog
        open = {true}
        PaperProps={{sx : dialogStyle}}
        hideBackdrop={true}
        maxWidth={'md'}
    >
        <div className='chat-section'>
            <div className='menu-section'>

              <Menu/>
              
            </div>

            <div className='empty-chat'>
                {Object.keys(person).length ? <ChatUser/> : <Emptychat/>}
            </div>

        </div>
    </Dialog>
    // </>
  )
}

export default Chatbox