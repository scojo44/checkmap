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

  const mapStyles = {
    color: 'blue',
    fill: false,
    weight: 2,
    opacity: .5
  }

  return (
    <section className="Home">
      <MapContainer center={[37, -96]} zoom={5}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        {counties && counties.regions.map(region => <GeoJSON key={region.id} data={region.boundary} style={mapStyles}/>)}
      </MapContainer>
      <div className="dimmer">
        {location.pathname === '/' &&
          <div className="landing">
            <h1>CheckMap</h1>
            <h2>Welcome!</h2>
            <p>CheckMap is a simple site to track states and counties you've visited.</p>
            <p>Sign up, create a list, then just click on the regions you have visited!</p>
            <p>You can create more lists to track where you have done something special like
              caught a fish, played golf, rode your motorcycle, found a geocache...</p>
          </div>
        }
      </div>
    </section>
  );
}
