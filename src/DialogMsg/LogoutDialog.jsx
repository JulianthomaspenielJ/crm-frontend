import React, { useState } from 'react'
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


 

function LogoutDialog({dialogMsg,setDialogMsg}) {

  const navigate =useNavigate()
    
  
    const handleClose = () => {
      setDialogMsg(false);
    };

    const Logout =()=>{
      localStorage.removeItem("userData");
      navigate("/thankyou")
      
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
      <DialogTitle>{"Confirmation"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
        Are you sure, You want to Logout the Holoware CRM.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant='outlined'>No</Button>
        <Button onClick={()=>{Logout()}} variant='contained'>YES</Button>
      </DialogActions>
    </Dialog>
  </React.Fragment> 

  )
}

export default LogoutDialog