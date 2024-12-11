import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (!token) return;

      try {
        const response = await axios.get(`https://studygroupmanager.onrender.com/api/students/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        localStorage.removeItem('token'); // Clear invalid token
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Study Group Manager</h1>

      {currentUser ? (
        <div>
          <p>Welcome, {currentUser.name} ({currentUser.email})</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      )}

      <div style={{ margin: '20px' }}>
        <h2>Manage Students</h2>
        <button onClick={() => navigate('/students')} disabled={!currentUser}>
          View Students
        </button>
      </div>

      <div style={{ margin: '20px' }}>
        <h2>Manage Study Groups</h2>
        <button onClick={() => navigate('/study-groups')} disabled={!currentUser}>
          View Study Groups
        </button>
      </div>

      <div style={{ margin: '20px' }}>
        <h2>Manage Rooms</h2>
        <button onClick={() => navigate('/rooms')} disabled={!currentUser}>
          Manage Rooms
        </button>
      </div>

      <div style={{ margin: '20px' }}>
        <h2>Reports</h2>
        <button onClick={() => navigate('/report')} disabled={!currentUser}>
          Generate Report
        </button>
      </div>
    </div>
  );
}