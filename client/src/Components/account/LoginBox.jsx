import {Dialog} from '@mui/material';
import SignIn from './Signin';

const dialogStyle = {
    height : '85%',
    marginTop : '3rem',
    width : '60%',
    maxWidth: '100%',
    maxHeight: '100%',
    boxShadow: 'none',
    overflow: 'hidden',
    backgroundColor: '#e6f2ff'
} 

function LoginBox() {
  return (
    <Dialog
        open = {true}
        PaperProps={{sx : dialogStyle}}
        hideBackdrop={true}
    >
        <SignIn/>
    </Dialog>
  )
}

export default LoginBox