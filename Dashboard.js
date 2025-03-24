import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        alert('User not logged in');
        navigate('/login');
      }
    };
    fetchDashboardData();
  }, [navigate]);

  return (
    <div>
      <h2>Dashboard</h2>
      {cards.map(card => (
        <div key={card.id} onClick={() => navigate('/map', { state: { cardId: card.id } })}>
          {card.title}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;