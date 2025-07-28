import { Box, Grid, IconButton, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

// Function to group emails by date
const groupEmailsByDate = (emails) => {
  return emails.reduce((acc, email) => {
    const date = dayjs(email.createdAt).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(email);
    return acc;
  }, {});
};

function EmailList({ renderImg, ActivityData, setEmailOpen }) {
  const [expandedEmails, setExpandedEmails] = useState({});

  // Function to toggle the expanded state of an email
  const toggleExpand = (date, emailIndex) => {
    const key = `${date}-${emailIndex}`;
    setExpandedEmails((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Get today's date
  const today = dayjs().format("YYYY-MM-DD");
  // Group emails by date
  const groupedEmails = groupEmailsByDate(ActivityData?.mail || []);

  // Filter and sort the dates
  const filteredDates =
    Object.keys(groupedEmails) &&
    Object.keys(groupedEmails)
      .filter((date) => dayjs(date).isSameOrBefore(today))
      .sort((a, b) => dayjs(b).diff(dayjs(a)));

  return (
    <Box sx={{ height: "100%" }}>
      {/* Compose Email Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          pr: 5,
         py:3
        
        }}
      >
        <Button variant="contained" onClick={() => setEmailOpen(true)}>
          Create Email
        </Button>
      </Box>
      {/* Email List */}
      {filteredDates.length > 0
        ? filteredDates.map((date) => (
            <Box
              key={date}
              sx={{
                height: "90%",

                overflowY: "auto",
                overflowX: "hidden",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Grid container style={{ cursor: "pointer" }}>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#1976d2",
                    }}
                  >
                    Sent At - {dayjs(date).format("DD MMM YYYY")}
                  </Typography>
                </Grid>
                {groupedEmails[date] &&
                  groupedEmails[date].map((email, emailIndex) => (
                    <Grid
                      key={`${date}-${emailIndex}`} // Unique key for each Grid
                      container
                      sx={{ bgcolor: "#f1f1f1de", my: 1, mr: 2, p: 1 }}
                    >
                      <Grid item xs={1}>
                        <IconButton
                          sx={{ color: "#1976d2" }}
                          onClick={() => {
                            toggleExpand(date, emailIndex); // Toggle email expand/collapse
                          }}
                        >
                          {expandedEmails[`${date}-${emailIndex}`] ? ( // Use unique key for expandedEmails
                            <RemoveIcon />
                          ) : (
                            <AddIcon />
                          )}
                        </IconButton>
                      </Grid>

                      <Grid item xs={11}>
                        {expandedEmails[`${date}-${emailIndex}`] ? (
                          <>
                            <Typography
                              sx={{
                                fontSize: 12,
                                mt: 1,
                              }}
                            >
                              <b>Status : {email.status}</b> <br/>
                              <b>{email.mailFrom}</b> sent an email to{" "}
                              <b>{email.mailTo}</b>
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                mt: 1,
                              }}
                            >
                              <b>From: </b> {email.mailFrom}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                mt: 1,
                              }}
                            >
                              <b>To: </b> {email.mailTo}
                            </Typography>
                            {email.MailCC?.String && (
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  mt: 1,
                                }}
                              >
                                <b>CC: </b> {email.MailCC.String}
                              </Typography>
                            )}
                            <Typography
                              sx={{
                                fontSize: 12,
                                mt: 1,
                              }}
                            >
                              <b>Subject: </b> {email.mailSubject}
                            </Typography>
                            <Box
                              sx={{
                                alignItems: "center",
                                pt: 1,
                              }}
                            >
                              <Typography
                                sx={{ fontSize: 12, fontWeight: 600 }}
                              >
                                Body
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  mt: 1,
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: email.mailBody,
                                }}
                              />
                            </Box>
                          </>
                        ) : (
                          <>
                            <Typography
                              sx={{
                                fontSize: 12,
                                mt: 1,
                              }}
                            >
                              <b>{email.mailFrom}</b> sent an email to{" "}
                              <b>{email.mailTo}</b>
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                fontWeight: 700,
                                mt: 1,
                              }}
                            >
                              <b>Subject: </b> {email.mailSubject}
                            </Typography>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          ))
        : renderImg()}
    </Box>
  );
}

export default EmailList;
