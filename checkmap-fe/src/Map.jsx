import React, {useState, useContext, useEffect} from 'react'
import {MapContainer, TileLayer, GeoJSON} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import UserContext from './UserContext'
import CheckMapAPI from './api'

export default function Map(props) {
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const {currentList, setCurrentList, showAlert} = useContext(UserContext);
  // const {data, setApiCall, error, isLoading} = useCheckMapAPI();
  const [allRegions, setAllRegions] = useState();
  let listRegions;

  if(allRegions) listRegions = currentList[allRegions.regionProp];

  useEffect(() => {
    async function getAllRegions() {
      try {
        setIsLoadingRegions(true);
        const regions = await CheckMapAPI.getRegions(currentList.regionType);
        setAllRegions(regions);
      }
      catch(e) {
        showAlert('error', `Error loading all ${currentList.regionType} regions`);
        setAllRegions(null);
      }
      setIsLoadingRegions(false);
    }

    currentList? getAllRegions() : setAllRegions(null);
  }, [currentList]);

  const mapStyles = {
    color: 'black',
    fillOpacity: 0,
    weight: 2,
    opacity: .3
  }
  const listStyles = {
    fillOpacity: .5,
    fillColor: currentList.color
  }

  return (
    <>
    <MapContainer center={[40, -96]} zoom={5}>
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
      {allRegions && allRegions.regions.map(region => {
        const regionStyles = listRegions.find(lr => lr.id === region.id)? listStyles: {}; // Set marked region fill color
        return <GeoJSON key={region.id} data={region.boundary} style={{...mapStyles, ...regionStyles}}
          eventHandlers={{click: handleClick}}
        />
      })}
    </MapContainer>
    </>
  )

  async function handleClick({sourceTarget}) {
    const regionID = +sourceTarget.feature.properties.geoid;
    const operation = {};

    try {
      if(!listRegions.find(r => r.id === regionID)) {
        operation.op = 'adding';
        operation.fromTo = 'to';
        const addedRegion = await CheckMapAPI.addRegion(currentList.id, regionID);
        listRegions.push(addedRegion);
        setCurrentList(list => ({...list}))
      }
      else {
        operation.op = 'removing';
        operation.fromTo = 'from';
        const removedRegion = await CheckMapAPI.removeRegion(currentList.id, regionID);
        const removeIndex = listRegions.findIndex(r => r.id === removedRegion.id);
        listRegions.splice(removeIndex, 1);
        setCurrentList(list => ({...list}));
      }
    }
    catch(e) {
      const {name} = sourceTarget.feature.properties;
      showAlert('error', `Error ${operation.op} ${name} (#${regionID}) ${operation.fromTo} list #${currentList.id}:`);
    }
}
}
