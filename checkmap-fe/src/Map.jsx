import React, {useState, useContext, useEffect} from 'react'
import {MapContainer, TileLayer, Polygon, GeoJSON} from 'react-leaflet'
import useCheckMapAPI from './hooks/useCheckMapAPI'
import ListForm from './lists/ListForm'
import 'leaflet/dist/leaflet.css'
import UserContext from './UserContext'
import CheckMapAPI from './api'

export default function Map(props) {
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const {user, showAlert} = useContext(UserContext);
  const [allRegions, setAllRegions] = useState();
  const [list, setList] = useState(user.lists[0]);
  const {data, setApiCall, error, isLoading} = useCheckMapAPI();
  const [geoJSONs, setGeoJSONs] = useState([]);

  useEffect(() => {
    async function getAllRegions() {
      try {
        setIsLoadingRegions(true);
        const regions = await CheckMapAPI.getRegions(list.regionType);
        setAllRegions(regions);
      }
      catch(e) {
        showAlert('error', `Error loading all ${list.regionType} regions`);
        setAllRegions(null);
      }
      setIsLoadingRegions(false);
    }

    list? getAllRegions() : setAllRegions(null);
  }, [list]);
  // if(list) setApiCall('getRegions', list.regionType);

  return (
    <>
    <ListForm setList={setList} />
    <MapContainer center={[48.75, -116.25]} zoom={11}>
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
        let regionColor = 'mediumpurple';
        if(list[allRegions.regionProp].find(lr => lr.id === region.id)) regionColor = 'cornflowerblue';
        return <GeoJSON key={region.id} data={region.boundary} style={{color: regionColor}}
          eventHandlers={{click: handleClick}}
        />
      })}
      {/* <GeoJSON data={counties5m} key={'5m'} style={{color: 'indigo'}} /> */}
    </MapContainer>
    </>
  )

  async function handleClick({sourceTarget}) {
    const regionID = +sourceTarget.feature.properties.geoid;
    let operation;

    try {
      if(!list[allRegions.regionProp].find(r => r.id === regionID)) {
        operation = 'adding';
        const region = await CheckMapAPI.addRegion(list.id, regionID);
        list[allRegions.regionProp].push(region);
        setList(list => ({...list}))
      }
      else {
        operation = 'removing';
        const region = await CheckMapAPI.removeRegion(list.id, regionID);
        const removeIndex = list[allRegions.regionProp].findIndex(r => r.id === regionID);
        list[allRegions.regionProp].splice(removeIndex, 1);
        setList(list => ({...list}));
      }
    }
    catch(e) {
      const {name} = sourceTarget.feature.properties;
      showAlert('error', `Error ${operation} ${name} (#${regionID}) from list #${list.id}:`);
    }
}
}
