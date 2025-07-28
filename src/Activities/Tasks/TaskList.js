import { Box, Grid, IconButton, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

// Function to group tasks by date
const groupTasksByDate = (tasks) => {
  // Check if tasks is an array, if not default to an empty array
  if (!Array.isArray(tasks)) {
    return {};
  }

  // Use reduce to group tasks by date
  return tasks.reduce((acc, task) => {
    const date = dayjs(task.createdAt).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});
};
function TasksList({ renderImg, ActivityData, setTaskOpen }) {
  const [expandedTasks, setExpandedTasks] = useState({});

  // Function to toggle the expanded state of a task
  const toggleExpand = (date, taskIndex) => {
    const key = `${date}-${taskIndex}`;
    setExpandedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Get today's date
  const today = dayjs().format("YYYY-MM-DD");
  // Group tasks by date
  const groupedTasks = groupTasksByDate(ActivityData?.tasks || []);

  // Filter and sort the dates
  const filteredDates =
    Object.keys(groupedTasks) &&
    Object.keys(groupedTasks)
      .filter((date) => dayjs(date).isSameOrBefore(today))
      .sort((a, b) => dayjs(b).diff(dayjs(a)));

  return (
    <Box sx={{ height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          pr: 5,
         py:3
        }}
      >
        <Button variant="contained" onClick={() => setTaskOpen(true)}>
          Create Task
        </Button>
      </Box>

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
                    Created At - {dayjs(date).format("DD MMM YYYY")}
                  </Typography>
                </Grid>
                {groupedTasks[date] &&
                  groupedTasks[date].map((task, taskIndex) => (
                    <Grid
                      key={`${date}-${taskIndex}`} // Unique key for each Grid
                      container
                      sx={{ bgcolor: "#f1f1f1de", my: 1, mr: 2 }}
                    >
                      <Grid item xs={1}>
                        <IconButton
                          sx={{ color: "#1976d2" }}
                          onClick={() => {
                            toggleExpand(date, taskIndex); // Toggle task expand/collapse
                          }}
                        >
                          {expandedTasks[`${date}-${taskIndex}`] ? ( // Use unique key for expandedTasks
                            <RemoveIcon />
                          ) : (
                            <AddIcon />
                          )}
                        </IconButton>
                      </Grid>

                      <Grid item xs={11}>
                        {expandedTasks[`${date}-${taskIndex}`] ? (
                          <>
                            <Typography sx={{ mt: 1, fontSize: 13 }}>
                              <b>{task.createdBy.split("(")[0]} </b> created one{" "}
                              <b>{task.taskType} </b> task at {task.createdAt}
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
                                  Task :
                                </Typography>
                                <Typography sx={{ fontSize: 13, pl: 1 }}>
                                  {task.task}
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
                                  Date :
                                </Typography>
                                <Typography sx={{ fontSize: 13, pl: 1 }}>
                                  {task.date}
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
                                  __html: task.notes,
                                }}
                              />
                            </Box>
                          </>
                        ) : (
                          <>
                            <Typography sx={{ mt: 1, fontSize: 13 }}>
                              <b>{task.createdBy.split("(")[0]} </b> created one{" "}
                              <b>{task.taskType} </b> task at {task.createdAt}
                            </Typography>
                          </>
                        )}

                        {/* <Typography
                          dangerouslySetInnerHTML={{
                            __html: expandedTasks[`${date}-${taskIndex}`]
                              ? task.notes
                              : task.notes?.slice(0, 80) + "...",
                          }}
                        /> */}
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

export default TasksList;
