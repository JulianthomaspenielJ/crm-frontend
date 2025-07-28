import React from 'react';
import { Box, Typography, Stack, Alert, Button } from '@mui/material';

const NotificationPage = ({ notifications, clearNotifications, markAsRead }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Notification Center
      </Typography>
      <Stack spacing={2}>
        {notifications.length === 0 ? (
          <Typography variant="body1">No notifications available.</Typography>
        ) : (
          notifications.map((notification) => (
            <Alert
              key={notification.id}
              severity={notification.isRead ? "info" : "warning"}
              action={
                !notification.isRead && (
                  <Button color="inherit" onClick={() => markAsRead(notification.id)}>
                    Mark as Read
                  </Button>
                )
              }
            >
              {notification.message} <strong>Deal ID: {notification.dealID}</strong>
            </Alert>
          ))
        )}
      </Stack>
      <Button variant="contained" onClick={clearNotifications} sx={{ marginTop: 2 }}>
        Clear All Notifications
      </Button>
    </Box>
  );
};

export default NotificationPage;
