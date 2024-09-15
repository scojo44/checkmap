import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import {MapContainer, TileLayer, GeoJSON} from 'react-leaflet'
import CheckMapAPI from './api';
import UserContext from './UserContext';
import 'leaflet/dist/leaflet.css'
import './Home.css'

export default function Home() {
  const navigate = useNavigate();
  const {user} = useContext(UserContext);
  const [counties, setCounties] = useState(null);

  useEffect(() => {
    async function getCounties() {
      try {
        const regions = await CheckMapAPI.getRegions("County");
        setCounties(regions);
      }
      catch(e) {
        console.debug('Error loading all county regions:', e);
        setCounties(null);
      }
    }

    getCounties();
  }, []);

  // Send logged in user to the user map
  if(user) {
    navigate('/map');
    return;
  }

  const pathOptions = {
    color: 'blue',
    fill: false,
    weight: 2,
    opacity: .5
  }

  return (
    <MapContainer center={[37, -96]} zoom={5}>
      <h2>Welcome!</h2>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {counties && counties.regions.map(region => <GeoJSON key={region.id} data={region.boundary} style={pathOptions}/>)}
    </MapContainer>
  );
}
