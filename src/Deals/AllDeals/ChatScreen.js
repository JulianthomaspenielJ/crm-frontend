import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Box,
  List,
  ListItem,
  DialogActions,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import AuthService from "../../services/AuthService";

function ChatDialog({ open, onClose, id, data, fetchChatData }) {
  const CRMBaseURL = AuthService();
  const [message, setMessage] = useState("");
  const listEndRef = useRef(null);
  const storedUserData = JSON.parse(localStorage.getItem("userData"));
  const createdBy =
    storedUserData && `${storedUserData.userName} (${storedUserData.email})`;

  useEffect(() => {
    if (listEndRef.current) {
      listEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  const updateChatData = async () => {
    const fetchData = {
      dealID: id,
    };
    try {
      const chatData = await fetchChatData(fetchData);
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      updateChatData(); 
    }, 2000);
    return () => clearInterval(interval); 
  }, [id]); 

  const handleSend = async () => {
    const values = {
      dealID: id,
      createdBy: createdBy,
      message: message,
    };
    try {
      const res = await CRMBaseURL.post("addchat", values);
    } catch (e) {
      console.log(e);
    }
    setMessage("");
    const fetchData = {
      dealID: id,
    };
    fetchChatData(fetchData);
  };

  const getFirstName = (fullNameOrEmail) => {
    const namePart = fullNameOrEmail.split(" ")[0];
    return namePart.split("@")[0];
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          position: "fixed",
          right: 0,
          margin: 0,
          height: "80%",
          width: "400px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "19px",
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#E5DDD5",
        },
      }}
    >
      <DialogTitle
        sx={{
          padding: "10px 20px",
          fontWeight: "bold",
          background:
            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
          color: "white",
        }}
      >
        Chat
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", right: 10, top: 10, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          flexGrow: 1,
          padding: "20px",
          backgroundColor: "#ECE5DD",
          overflowY: "auto",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <List sx={{ display: "flex", flexDirection: "column" }}>
            {data && data.length > 0 ? (
              data.map((chatItem, index) => {
                const isSameSenderAsPrevious =
                  index > 0 && data[index - 1].createdBy === chatItem.createdBy;

                return (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent:
                        chatItem.createdBy === createdBy
                          ? "flex-end"
                          : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        padding: "10px 15px",
                        borderRadius: "7px",
                        color:
                          chatItem.createdBy === createdBy ? "#fff" : "#333",
                        backgroundColor:
                          chatItem.createdBy === createdBy
                            ? "#0f8fff"
                            : "#f5f5f5",
                        maxWidth: "70%",
                        wordWrap: "break-word",
                        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                        position: "relative",
                      }}
                    >
                      {!isSameSenderAsPrevious && (
                        <Box
                          sx={{
                            fontSize: 12,
                            fontWeight: "bold",
                            marginBottom: "5px",
                            color:
                              chatItem.createdBy === createdBy
                                ? "#fff"
                                : "#075E54",
                          }}
                        >
                          {getFirstName(chatItem.createdBy)}
                        </Box>
                      )}
                      <Box sx={{ fontSize: 13 }}>{chatItem.message}</Box>
                      <Box
                        sx={{
                          fontSize: 10,
                          color:
                            chatItem.createdBy === createdBy
                              ? "#f9fcfe"
                              : "#888",
                          textAlign: "right",
                          marginTop: "5px",
                        }}
                      >
                        {chatItem.createdAt}
                      </Box>
                    </Box>
                  </ListItem>
                );
              })
            ) : (
              <ListItem>No messages</ListItem>
            )}
            <div ref={listEndRef} />
          </List>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: "10px", backgroundColor: "#ECE5DD" }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          <TextField
            variant="outlined"
            placeholder="Type a message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              flexGrow: 1,
              marginRight: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                backgroundColor: "#fff",
              },
            }}
          />
          <IconButton
            sx={{
              color: message ? "#128C7E" : "#bbb",
              marginLeft: "5px",
            }}
            onClick={handleSend}
            disabled={!message}
          >
            <SendIcon fontSize="large" />
          </IconButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default ChatDialog;