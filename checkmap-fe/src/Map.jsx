import React, {useContext} from 'react'
import {MapContainer, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import UserContext from './UserContext'
import ModalOutlet from './ModalOutlet'
import Alert from './widgets/Alert'
import Regions from './Regions'
import './Map.css'

export default function Map({alerts, dismissAlert, clearAlerts = test => test}) {
  const {user} = useContext(UserContext);
  const atHome = location.pathname === '/';
  const showModal = !user || (user && !atHome); // Hide the welcome message if user logged in on "/" (the home map)

  return (
    <>
    <MapContainer className="Map" center={[40, -96]} zoom={5}>
      {showModal // Show alerts in the modal if open
        ? <ModalOutlet {...{alerts, dismissAlert, clearAlerts}}/>
        : <Alert alerts={alerts} dismiss={dismissAlert}/>
      }
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        eventHandlers={{
          tileloadstart: async ({coords: {x, y, z}}) => {
            /* This was a try at using geojson-vt. Might revisit later.
            console.log('====', x, y, 'zoom:', z);
            const resp = await axios.get(`http://10.1.1.73:8123/us-county-boundaries/${z}/${x}/${y}.geojson`);
            console.log('====', resp);
            if(resp.data)
              setGeoJSONs(geos => {
                const keyXYZ = `${z}:${x}-${y}`;
                const tileData = {geojson: resp.data, key: keyXYZ};
                const tileIndex = geos.findIndex(g => g.key === keyXYZ);
                // Update existing tile geoJSON or add new
                if(tileIndex !== -1)
                  geos[tileIndex] = tileData;
                else 
                  geos.push(tileData);
                return [...geos];
              }); */
          }
        }}
      />
      <Regions/>
    </MapContainer>
    </>
  )
}
