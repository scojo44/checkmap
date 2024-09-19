import React, {useState, useContext, useEffect} from 'react'
import {MapContainer, TileLayer, GeoJSON} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import CheckMapAPI from './api'
import UserContext from './UserContext'
import ModalOutlet from './ModalOutlet'

export default function Map(props) {
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const {user, currentList, setCurrentList, showAlert} = useContext(UserContext);
  // const {data, setApiCall, error, isLoading} = useCheckMapAPI();
  const [allRegions, setAllRegions] = useState();
  const [allStates, setAllStates] = useState();
  const allowModal = !user || (location.pathname !== '/' && user); // Hide the welcome message if user logged in on "/" (the home map)
  let listRegions;

  if(allRegions && currentList) listRegions = currentList[allRegions.regionProp];

  useEffect(() => {
    async function getAllRegions() {
      const regionType = currentList?.regionType || "County";
      try {
        setIsLoadingRegions(true);
        setAllRegions(await CheckMapAPI.getRegions(regionType));
        // Get the state polygons for thicker state borders
        if(!allStates) setAllStates(await CheckMapAPI.getRegions('State'));
      }
      catch(e) {
        showAlert('error', `Error loading all ${regionType} regions`);
      }
      setIsLoadingRegions(false);
    }

    getAllRegions();
  }, [currentList]);

  const stateStyles = {
    color: 'black',
    fill: false,
    weight: 3,
    opacity: .3
  }
  const regionStyles = {
    color: 'black',
    fill: !!user, // False makes the regions not clickable for guests
    fillOpacity: 0,
    weight: 2,
    opacity: .3
  }
  const listStyles = {
    ...regionStyles,
    fillOpacity: .5,
    fillColor: currentList?.color || 'black' // In case user doesn't have a list yet
  }

  return (
    <>
    <MapContainer center={[40, -96]} zoom={5}>
      {allowModal && <ModalOutlet/>}
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
      {allStates && allRegions.regionProp !== 'states' && allStates.regions.map(state => <GeoJSON key={state.id} data={state.boundary} style={stateStyles} />)}
      {allRegions && allRegions.regions.map(region => {
        // Give the list's regions a different style
        const regionInList = currentList && listRegions.find(lr => lr.id === region.id);
        return <GeoJSON key={region.id} data={region.boundary} style={regionInList? listStyles : regionStyles} eventHandlers={{click: handleClick}} />
      })}
    </MapContainer>
    </>
  )

  /** handleClick:  Toggles the region color. */

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
