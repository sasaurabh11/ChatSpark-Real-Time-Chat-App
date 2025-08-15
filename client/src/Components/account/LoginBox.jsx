import { Dialog } from '@mui/material';
import SignIn from './Signin';

function LoginBox() {
  return (
    <Dialog
      open={true}
      PaperProps={{
        sx: {
          width: '90%',
          maxWidth: '450px',
          height: 'auto',
          maxHeight: '90vh',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: 'rgb(31, 41, 55)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      }}
      hideBackdrop={true}
    >
      <SignIn />
    </Dialog>
  )
}

export default LoginBox;