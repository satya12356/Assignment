import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

function MapView() {
  const [mapData, setMapData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/map', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMapData(response.data);
      } catch (error) {
        console.error('Failed to fetch map data:', error);
        alert('User not logged in');
        navigate('/login');
      }
    };
    fetchMapData();
  }, [navigate]);

  if (!mapData) {
    return <div>Loading...</div>;
  }

  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  return (
    <MapContainer center={mapData.center} zoom={mapData.zoom} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ChangeView center={mapData.center} zoom={mapData.zoom} />
    </MapContainer>
  );
}

export default MapView;