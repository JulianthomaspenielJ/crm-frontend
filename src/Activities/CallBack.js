// Callback.js
import React, { useEffect } from 'react';
import AuthService from "../services/AuthService";

const Callback = () => {
  const CRMBaseURL = AuthService();
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      try {
        if (code) {
          const response = await CRMBaseURL.post('meetgoogle', { code });

          if (response.status === 200) {
            const data = response.data;
            alert(`Google Meet Link: ${data.meeting_url}`);
          } else {
            alert('Failed to create Google Meet link');
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    handleCallback();
  }, []);

  return <div>Processing your request...</div>;
};

export default Callback;
