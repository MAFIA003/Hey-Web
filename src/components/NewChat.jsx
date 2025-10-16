// src/components/NewChat.jsx
import { useState } from 'react';
import './NewChat.css';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useStateValue } from '../StateProvider';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';

function NewChat() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [{ user: currentUser }] = useStateValue();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    const lowercasedTerm = searchTerm.toLowerCase();
    const usersRef = collection(db, 'users');
    // Create a query to find users by displayName
    const q = query(
        usersRef, 
        where('displayName_lowercase', '>=', lowercasedTerm), 
        where('displayName_lowercase', '<=', lowercasedTerm + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    const searchResults = [];
    querySnapshot.forEach((doc) => {
      // Make sure not to include the current user in search results
      if (doc.id !== currentUser.uid) {
        searchResults.push({ id: doc.id, ...doc.data() });
      }
    });
    setUsers(searchResults);
  };

  const createChat = async (selectedUser) => {
    // Check if a chat already exists between the two users
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('users', 'array-contains', currentUser.uid));
    const querySnapshot = await getDocs(q);

    let existingChat = null;
    querySnapshot.forEach(doc => {
        const chatData = doc.data();
        if (chatData.users.includes(selectedUser.id)) {
            existingChat = { id: doc.id, ...chatData };
        }
    });

    if (existingChat) {
        // If chat exists, navigate to it
        navigate(`/chats/${existingChat.id}`);
    } else {
        // If chat doesn't exist, create it
        const newChatRef = await addDoc(collection(db, 'chats'), {
            users: [currentUser.uid, selectedUser.id],
            lastUpdated: serverTimestamp()
        });
        navigate(`/chats/${newChatRef.id}`);
    }
  };

  return (
    <div className="newChat">
      <div className="newChat__header">
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search for a user by name" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" style={{display: "none"}}>Search</button>
        </form>
      </div>
      <div className="newChat__results">
        {users.map((foundUser) => (
          <div key={foundUser.id} className="newChat__user" onClick={() => createChat(foundUser)}>
            <Avatar src={foundUser.photoURL} />
            <div className="newChat__userInfo">
              <h3>{foundUser.displayName}</h3>
              <p>{foundUser.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewChat;