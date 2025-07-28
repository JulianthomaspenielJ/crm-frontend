import { Box, Grid, IconButton, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

// Function to group meetings by date
const groupMeetingsByDate = (meetings) => {
  // Check if meetings is an array, if not default to an empty array
  if (!Array.isArray(meetings)) {
    return {};
  }

  // Use reduce to group meetings by date
  return meetings.reduce((acc, meeting) => {
    const date = dayjs(meeting.createdAt).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(meeting);
    return acc;
  }, {});
};

function LogMeetingList({ renderImg, ActivityData, setLogMeetingOpen }) {
  const [expandedMeetings, setExpandedMeetings] = useState({});

  // Function to toggle the expanded state of a meeting
  const toggleExpand = (date, meetingIndex) => {
    const key = `${date}-${meetingIndex}`;
    setExpandedMeetings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Get today's date
  const today = dayjs().format("YYYY-MM-DD");
  // Group meetings by date
  const groupedMeetings = groupMeetingsByDate(ActivityData?.meetings || []);

  // Filter and sort the dates
  const filteredDates =
    Object.keys(groupedMeetings) &&
    Object.keys(groupedMeetings)
      .filter((date) => dayjs(date).isSameOrBefore(today))
      .sort((a, b) => dayjs(b).diff(dayjs(a)));

  return (
    <Box sx={{ height: "100%" }}>
      {/* Create Meeting Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          gap: 2,
          pr: 5,
         py:3
  
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            setLogMeetingOpen(true);
          }}
        >
          Log Meeting
        </Button>
        <Button variant="contained">Create Meeting</Button>
      </Box>
      {/* Meeting List */}
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
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1976d2",
                    }}
                  >
                    Created At - {dayjs(date).format("DD MMM YYYY")}
                  </Typography>
                </Grid>
                {groupedMeetings[date] &&
                  groupedMeetings[date].map((meeting, meetingIndex) => (
                    <Grid
                      key={`${date}-${meetingIndex}`} // Unique key for each Grid
                      container
                      sx={{ bgcolor: "#f1f1f1de", my: 1, mr: 2 }}
                    >
                      <Grid item xs={1}>
                        <IconButton
                          sx={{ color: "#1976d2" }}
                          onClick={() => {
                            toggleExpand(date, meetingIndex); // Toggle meeting expand/collapse
                          }}
                        >
                          {expandedMeetings[`${date}-${meetingIndex}`] ? ( // Use unique key for expandedMeetings
                            <RemoveIcon />
                          ) : (
                            <AddIcon />
                          )}
                        </IconButton>
                      </Grid>

                      <Grid item xs={11}>
                        {expandedMeetings[`${date}-${meetingIndex}`] ? (
                          <>
                            <Typography sx={{ mt: 1, fontSize: 13 }}>
                              <b>{meeting.createdBy} </b> scheduled a{" "}
                              <b>{meeting.outCome} </b> meeting at{" "}
                              {meeting.createdAt}
                            </Typography>
                            <Grid>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  pt: 1,
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: 13, fontWeight: 600 }}
                                >
                                  Meeting Outcome:
                                </Typography>
                                <Typography sx={{ fontSize: 13, pl: 1 }}>
                                  {meeting.outCome}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  pt: 1,
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: 13, fontWeight: 600 }}
                                >
                                  Attendees:
                                </Typography>
                                <Typography sx={{ fontSize: 13, pl: 1 }}>
                                  {meeting.attendeesList}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  pt: 1,
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: 13, fontWeight: 600 }}
                                >
                                  Date:
                                </Typography>
                                <Typography sx={{ fontSize: 13, pl: 1 }}>
                                  {meeting.date}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  pt: 1,
                                }}
                              >
                                <Typography
                                  sx={{ fontSize: 13, fontWeight: 600 }}
                                >
                                  Duration:
                                </Typography>
                                <Typography sx={{ fontSize: 13, pl: 1 }}>
                                  {meeting.duration || " "}
                                </Typography>
                              </Box>
                            </Grid>
                            <Box
                              sx={{
                                alignItems: "center",
                                pt: 1,
                              }}
                            >
                              <Typography
                                sx={{ fontSize: 13, fontWeight: 600 }}
                              >
                                Description
                              </Typography>
                              <Typography
                                dangerouslySetInnerHTML={{
                                  __html: meeting.notes,
                                }}
                              />
                            </Box>
                          </>
                        ) : (
                          <>
                            <Typography sx={{ mt: 1, fontSize: 13 }}>
                              <b>{meeting.createdBy} </b> created log meeting
                              and
                              <b> {meeting.outCome} </b> meeting at{" "}
                              {meeting.createdAt}
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

export default LogMeetingList;
