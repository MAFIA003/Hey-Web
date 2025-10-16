// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { Avatar, IconButton } from '@mui/material';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import { SearchOutlined } from '@mui/icons-material';
import SidebarChat from './SidebarChat';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useStateValue } from '../StateProvider';
import { Link } from 'react-router-dom';

function Sidebar() {
  const [chats, setChats] = useState([]);
  const [{ user }] = useStateValue();

  useEffect(() => {
    if (user) {
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('users', 'array-contains', user.uid));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Link to="/profile">
          <Avatar src={user?.photoURL} />
        </Link>
        <div className="sidebar__headerRight">
          <Link to="/new-chat">
            <IconButton>
              <ChatIcon />
            </IconButton>
          </Link>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <IconButton onClick={() => auth.signOut()}>
            <LogoutIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>

      <div className="sidebar__chats">
        {chats.map((chat) => (
          <SidebarChat 
            key={chat.id} 
            id={chat.id} 
            users={chat.data.users} 
            lastMessage={chat.data.lastMessage}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;