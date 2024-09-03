import React, { useState } from 'react'
import {MapContainer, TileLayer, Polygon} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

function App() {
  const [purple, setPurple] = useState(true);

  return (
    <MapContainer center={[48.75, -116.25]} zoom={11}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polygon positions={[[48.75, -116.25], [48.6, -116], [48.75, -116]]}
        pathOptions={{color: purple? 'mediumpurple':'cornflowerblue'}}
        eventHandlers={{
          click: (e) => {setPurple(c => !c);}
        }}
      />
    </MapContainer>
  );
}

export default App
