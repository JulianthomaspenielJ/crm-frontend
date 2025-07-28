import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
function LoginDialog({dialogMsg,setDialogMsg}) {

  const navigate =useNavigate()
    
  
    const handleClose = () => {
      setDialogMsg(false);
    };
    const Login =()=>{
      navigate("/login")
      
    }
    
  return (
   <React.Fragment>
    <Dialog
      open={dialogMsg}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Information"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
        You need to login for access the dashboard. Please login to continue.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>{Login()}} variant='contained'>Go to Login</Button>
      </DialogActions>
    </Dialog>
  </React.Fragment> 

  )
}

export default LoginDialog