// src/components/SidebarChat.jsx
import { useState, useEffect } from 'react';
import './SidebarChat.css';
import { Avatar } from '@mui/material';
import { db } from '../firebase';
import { Link, useParams } from 'react-router-dom'; // Import useParams
import { doc, onSnapshot } from 'firebase/firestore';
import { useStateValue } from '../StateProvider';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'; // Import camera icon

function SidebarChat({ id, users, lastMessage }) {
  const [otherUser, setOtherUser] = useState(null);
  const [{ user: currentUser }] = useStateValue();
  const { chatId } = useParams(); // Get the current chatId from the URL

  useEffect(() => {
    if (currentUser) {
      const otherUserId = users.find(uid => uid !== currentUser.uid);

      if (otherUserId) {
        const userDocRef = doc(db, 'users', otherUserId);
        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            setOtherUser(snapshot.data());
          }
        });
        return () => unsubscribe();
      }
    }
  }, [currentUser, users]);

  // Check if this chat is the one currently open
  const isActive = chatId === id;

  return otherUser ? (
    <Link to={`/chats/${id}`}>
      {/* Conditionally add the 'active' class */}
      <div className={`sidebarChat ${isActive ? 'active' : ''}`}>
        <Avatar src={otherUser.photoURL} />
        <div className="sidebarChat__info">
          <h2>{otherUser.displayName}</h2>
          <div className="sidebarChat__lastMessage">
            {/* Show camera icon if the last message was an image */}
            {lastMessage === '📷 Image' && <PhotoCameraIcon />}
            <p>{lastMessage}</p>
          </div>
        </div>
      </div>
    </Link>
  ) : null;
}

export default SidebarChat;