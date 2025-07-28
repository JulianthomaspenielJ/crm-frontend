import React, { useState } from "react";
import {Typography, Box, Tabs, Tab } from "@mui/material";
import NotesForm from "./Notes/NotesForm";
import NotesList from "./Notes/NotesList";
import TaskForm from "./Tasks/TaskForm";
import TasksList from "./Tasks/TaskList";
import EmailForm from "./Email/EmailForm";
import EmailList from "./Email/EmailList";
import LogMeetingForm from "./Meetings/LogMeetingForm";
import LogMeetingList from "./Meetings/LogMeetingList";

import userNotFound from "../Image/useeNotfound.webp";
import LogCallList from "./Calls/CallList";
import LogCallForm from "./Calls/CallLogForm";

function ActivitiesMain({ Id, ActivityData, type, fetchData }) {
  const [value, setValue] = useState("Notes");
  const [emailOpen, setEmailOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [logMeetingOpen, setLogMeetingOpen] = useState(false);
  const [logCallOpen, setLogCallOpen] = useState(false);

  const renderImg = () => (
    <div style={{ textAlign: "center" }}>
      <img
        src={userNotFound}
        style={{ width: 200, height: 200 }}
        alt="User not found"
      />
      <Typography>Currently, No data Found.</Typography>
    </div>
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Typography sx={{ fontWeight: 500, fontSize: 16, color: "#e02b6a", }}>Activities</Typography>
      <Box sx={{ width: "100%", height: "8%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{
            sx: {
              background:
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
            },
          }}
          sx={{
            "& .MuiTab-root": {
              background:
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            },
            "& .Mui-selected": {
              background:
                "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(44,60,224,1) 0%, rgba(0,181,255,1) 100%, rgba(0,212,255,1) 100%, rgba(11,10,125,1) 100%, rgba(9,9,121,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            },
          }}
          aria-label="secondary tabs example"
        >
          {/* <Tab value="Activity" label="Activity" /> */}
          <Tab value="Notes" label="Notes" />
          <Tab value="Emails" label="Emails" />
          <Tab value="Calls" label="Calls" />
          <Tab value="Tasks" label="Tasks" />
          <Tab value="Meetings" label="Meetings" />
        </Tabs>
      </Box>

      <Box sx={{ width: "100%", height: "88%" }}>
        {value === "Activity" && ""}
        {value === "Notes" && (
          <NotesList
            renderImg={renderImg}
            ActivityData={ActivityData}
            setNotesOpen={setNotesOpen}
          />
        )}
        {value === "Emails" && (
          <EmailList
            renderImg={renderImg}
            ActivityData={ActivityData}
            setEmailOpen={setEmailOpen}
          />
        )}
        {value === "Calls" && (
          <LogCallList
            renderImg={renderImg}
            ActivityData={ActivityData}
            setLogCallOpen={setLogCallOpen}
          />
        )}
        {value === "Tasks" && (
          <TasksList
            renderImg={renderImg}
            ActivityData={ActivityData}
            setTaskOpen={setTaskOpen}
          />
        )}
        {value === "Meetings" && (
          <LogMeetingList
            renderImg={renderImg}
            ActivityData={ActivityData}
            setLogMeetingOpen={setLogMeetingOpen}
          />
        )}
      </Box>

      <EmailForm
        emailOpen={emailOpen}
        setEmailOpen={setEmailOpen}
        id={Id}
        type={type}
        fetchData={fetchData}
      />
      <NotesForm
        notesOpen={notesOpen}
        setNotesOpen={setNotesOpen}
        id={Id}
        type={type}
        fetchData={fetchData}
      />
      <TaskForm
        taskOpen={taskOpen}
        setTaskOpen={setTaskOpen}
        id={Id}
        type={type}
        fetchData={fetchData}
      />

      <LogMeetingForm
        logMeetingOpen={logMeetingOpen}
        setLogMeetingOpen={setLogMeetingOpen}
        id={Id}
        type={type}
        fetchData={fetchData}
      />
      <LogCallForm
        logCallOpen={logCallOpen}
        setLogCallOpen={setLogCallOpen}
        id={Id}
        type={type}
        fetchData={fetchData}
      />
    </div>
  );
}

export default ActivitiesMain;
