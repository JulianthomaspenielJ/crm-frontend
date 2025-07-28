import { Box, Grid, IconButton, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

const groupNotesByDate = (notes) => {
  return notes.reduce((acc, note) => {
    const date = dayjs(note.createdAt).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(note);
    return acc;
  }, {});
};

function NotesList({ renderImg, ActivityData, setNotesOpen }) {
  const [expandedNotes, setExpandedNotes] = useState({});

  const toggleExpand = (date, noteIndex) => {
    const key = `${date}-${noteIndex}`;
    setExpandedNotes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const today = dayjs().format("YYYY-MM-DD");
  const groupedNotes = groupNotesByDate(ActivityData?.notes || []);

  const filteredDates =
    Object.keys(groupedNotes) &&
    Object.keys(groupedNotes)
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
        
        <Button variant="contained" onClick={() => setNotesOpen(true)}>
          Create Notes
        </Button>
      </Box>
      <Box
        sx={{
          height: "90%",

          overflowY: "auto",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {filteredDates.length > 0
          ? filteredDates.map((date) => (
              <Box key={date}>
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
                  {groupedNotes[date] &&
                    groupedNotes[date].map((note, noteIndex) => (
                      <Grid
                        key={`${date}-${noteIndex}`} // Adding a unique key to each Grid
                        container
                        sx={{ bgcolor: "#f1f1f1de", my: 1, mr: 2 }}
                      >
                        <Grid item xs={1}>
                          <IconButton
                            sx={{ color: "#1976d2", mt: 1 }}
                            onClick={() => {
                              toggleExpand(date, noteIndex); // Fixing the toggleExpand function call
                            }}
                          >
                            {expandedNotes[`${date}-${noteIndex}`] ? ( // Using a unique key for expandedNotes
                              <RemoveIcon />
                            ) : (
                              <AddIcon />
                            )}
                          </IconButton>
                        </Grid>

                        <Grid item xs={11}>
                          <Typography
                            sx={{ fontSize: 12 }}
                            dangerouslySetInnerHTML={{
                              __html: expandedNotes[`${date}-${noteIndex}`]
                                ? note.notes
                                : note.notes.slice(0, 80) + "...",
                            }}
                          />
                        </Grid>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            ))
          : renderImg()}
      </Box>
    </Box>
  );
}

export default NotesList;
