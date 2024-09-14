import React, {useState} from 'react'
import {useMap, Polygon, GeoJSON} from 'react-leaflet'

export default function TestPolygon(props) {
  const [purple, setPurple] = useState(true);
  const map = useMap();

  return (
    <Polygon positions={[[49.01, -117], [49.3, -116], [49.01, -116]]}
      pathOptions={{color: purple? 'indigo':'deeppink'}}
      eventHandlers={{
        click: async (e) => {
          setPurple(c => !c);
          const {lat, lng} = map.getCenter();
          console.log('==== click ====', lat, lng);
        }
      }}
    />
  )
}
