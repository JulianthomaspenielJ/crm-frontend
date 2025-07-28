import { Box, Grid, IconButton, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);


const groupCallsByDate = (calls) => {
 
  if (!Array.isArray(calls)) {
    return {};
  }

  // Use reduce to group calls by date
  return calls.reduce((acc, call) => {
    const date = dayjs(call.CallAt).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(call);
    return acc;
  }, {});
};

function LogCallList({ renderImg, ActivityData, setLogCallOpen }) {
  const [expandedCalls, setExpandedCalls] = useState({});

  const toggleExpand = (date, callIndex) => {
    const key = `${date}-${callIndex}`;
    setExpandedCalls((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const today = dayjs().format("YYYY-MM-DD");
  const groupedCalls = groupCallsByDate(ActivityData?.calls || []);

  const filteredDates =
    Object.keys(groupedCalls) &&
    Object.keys(groupedCalls)
      .filter((date) => dayjs(date).isSameOrBefore(today))
      .sort((a, b) => dayjs(b).diff(dayjs(a)));

  return (
    <Box sx={{ height: "100%" }} >
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
            setLogCallOpen(true);
          }}
        >
          Log Call
        </Button>
        <Button variant="contained">Create Call</Button>
      </Box>
      {/* Call List */}
      {filteredDates.length > 0
        ? filteredDates.map((date) => (
            <Box key={date}  sx={{
              height: "90%",

              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}>
              <Grid container style={{ cursor: "pointer" }}>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1976d2",
                    }}
                  >
                    Call Date - {dayjs(date).format("DD MMM YYYY")}
                  </Typography>
                </Grid>
                {groupedCalls[date] &&
                  groupedCalls[date].map((call, callIndex) => (
                    <Grid
                      key={`${date}-${callIndex}`} // Unique key for each Grid
                      container
                      sx={{ bgcolor: "#f1f1f1de", my: 1, mr: 2 }}
                    >
                      <Grid item xs={1}>
                        <IconButton
                          sx={{ color: "#1976d2" }}
                          onClick={() => {
                            toggleExpand(date, callIndex); // Toggle call expand/collapse
                          }}
                        >
                          {expandedCalls[`${date}-${callIndex}`] ? ( // Use unique key for expandedCalls
                            <RemoveIcon />
                          ) : (
                            <AddIcon />
                          )}
                        </IconButton>
                      </Grid>

                      <Grid item xs={11}>
                        {expandedCalls[`${date}-${callIndex}`] ? (
                          <>
                            <Typography sx={{ mt: 1 ,fontSize: 13}}>
                              Logged a call from <b>{call.callFrom}</b> to <b>{call.callTo}</b> at {call.callAt}
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
                                  Spoke With:
                                </Typography>
                                <Typography sx={{ fontSize: 13, pl: 1 }}>
                                  {call.CallToPersonName} ({call.CallToPersonEmail})
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
                                  {call.callAt}
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
                                  Call Directions:
                                </Typography>
                                <Typography sx={{ fontSize: 13, pl: 1 }}>
                                  {call.callDirection}
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
                                  Call Outcome:
                                </Typography>
                                <Typography sx={{ fontSize: 13, pl: 1 }}>
                                  {call.callOutcome || " "}
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
                                  __html: call.notes,
                                }}
                              />
                            </Box>
                          </>
                        ) : (
                          <>
                             <Typography sx={{ mt: 1 ,fontSize: 13}}>
                              Logged a call from <b>{call.callFrom}</b> to <b>{call.callTo}</b> at {call.callAt}
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

export default LogCallList;
