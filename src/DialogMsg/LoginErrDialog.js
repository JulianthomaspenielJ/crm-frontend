import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material'
import React from 'react'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function LoginErrDialog({loginErrDialog,setLoginErrDialog,setLoginErrMsg,loginErrMsg}) {
  return (
    <React.Fragment>
    <Dialog
      open={loginErrDialog}
      maxWidth="sm" 
      fullWidth
      
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Warning"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
        {loginErrMsg}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>{setLoginErrDialog(false)}} variant='contained'>ok</Button>
      </DialogActions>
    </Dialog>
  </React.Fragment> 
  )
}

export default LoginErrDialog