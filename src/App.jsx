// src/App.jsx
import { useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Login from './components/Login';
import Profile from './components/Profile';
import NewChat from './components/NewChat';
import { Routes, Route } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import { auth, db, rtdb } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { actionTypes } from './reducer';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, onValue, set, onDisconnect, serverTimestamp as rtdbServerTimestamp } from 'firebase/database';

function App() {
  // Pull the user and dispatch function from the global state
  const [{ user }, dispatch] = useStateValue();

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User is logged in
        dispatch({ type: actionTypes.SET_USER, user: authUser });

        const userRef = doc(db, 'users', authUser.uid);
        setDoc(userRef, {
        displayName: authUser.displayName,
        email: authUser.email,
        photoURL: authUser.photoURL,
        lastSeen: serverTimestamp(),
        displayName_lowercase: authUser.displayName.toLowerCase()
    }, { merge: true });

        // --- IMPROVED PRESENCE SYSTEM LOGIC ---
        const userStatusDatabaseRef = ref(rtdb, '/status/' + authUser.uid);
        const userStatusFirestoreRef = doc(db, 'users', authUser.uid);

        // This is the data that will be written when the user disconnects.
        const isOfflineForRTDB = {
            state: 'offline',
            last_changed: rtdbServerTimestamp(),
        };

        // This listener watches the client's connection state.
        onValue(ref(rtdb, '.info/connected'), (snapshot) => {
            // If the user is not connected, do nothing. The onDisconnect will handle it.
            if (snapshot.val() === false) {
                return;
            }

            // When the user connects, FIRST set the onDisconnect hook.
            // This tells the server what to do if the connection is lost.
            onDisconnect(userStatusDatabaseRef)
              .set(isOfflineForRTDB)
              .then(() => {
                // AFTER the onDisconnect hook is set, mark the user as online.
                // This ensures that if the browser is closed, the offline status is written.
                set(userStatusDatabaseRef, {
                  state: 'online',
                  last_changed: rtdbServerTimestamp(),
                });
                // Also update Firestore for a more persistent "online" status.
                setDoc(userStatusFirestoreRef, { lastSeen: 'online' }, { merge: true });
              });
        });
        
      } else {
        // User is logged out
        dispatch({ type: actionTypes.SET_USER, user: null });
      }
    });

    return () => unsubscribe();
}, [dispatch]);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Sidebar />
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/new-chat" element={<NewChat />} />
            <Route path="/chats/:chatId" element={<Chat />} />
            <Route path="/" element={
                <div className="welcome-screen">
                  <img src="/logo.png" alt="Hey Web Logo" />
                  <h1>Welcome to Hey Web</h1>
                  <p>Select a chat to start messaging.</p>
                </div>
                } />
            </Routes>
        </div>
      )}
    </div>
  );
}

export default App;