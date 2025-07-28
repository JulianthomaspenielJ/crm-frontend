
// import { initializeApp } from 'firebase/app';
// import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

// // Your Firebase config object
// const firebaseConfig = {
//   apiKey: "AIzaSyAwt16LQpqETOp3fKEgud6-guaZ1pHyFh0",
//   authDomain: "example-e2b49.firebaseapp.com",
//   projectId: "example-e2b49",
//   storageBucket: "example-e2b49.appspot.com",
//   messagingSenderId: "134646566324",
//   appId: "1:134646566324:web:67a972e7d6edc00e67b6e1",
//   vapidKey: "BDC54gGSrx3jlkC0p50qKl3yxCAUY0qnSHuAI4RI9Sghu1nQiGDl2sCZWOGWjyUpH1Ic84BVjWSZXOGpoX6zDcI",
// };

// // Initialize the Firebase app in the service worker
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Messaging in the service worker
// const messaging = getMessaging(app);

// // Handle background messages
// onBackgroundMessage(messaging, (payload) => {
//     console.log('Received background message: ', payload);
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//       body: payload.notification.body,
//       icon: payload.notification.icon,
//     };
  
//     // Use `this` instead of `self`
//     this.registration.showNotification(notificationTitle, notificationOptions);
//   });
  
