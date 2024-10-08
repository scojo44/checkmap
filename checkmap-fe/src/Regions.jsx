import React, {useState, useContext, useEffect} from 'react'
import {GeoJSON, Tooltip, useMapEvent} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import CheckMapAPI from './api'
import UserContext from './UserContext'
import './Map.css'

export default function Regions(props) {
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const {user, currentList, setCurrentList, showAlert} = useContext(UserContext);
  // const {data, setApiCall, error, isLoading} = useCheckMapAPI();
  const [allRegions, setAllRegions] = useState({}); // {states, counties, etc.}
  const REGIONS_ARRAY_NAME = currentList?.regionProp || 'counties';
  let listRegions;

  if(currentList)
    listRegions = currentList[currentList.regionProp];

  useEffect(() => {
    async function getAllRegions() {
      const regionType = currentList?.regionType || "County";

      try {
        setIsLoadingRegions(true);

        // Get the region polygons for the current list's region type if not already downloaded
        if(!allRegions[REGIONS_ARRAY_NAME])
          allRegions[REGIONS_ARRAY_NAME] = await CheckMapAPI.getRegions(regionType);

        // Get the state polygons for thicker state borders
        if(!allRegions.states)
          allRegions.states = await CheckMapAPI.getRegions('State');

        setAllRegions({...allRegions});
      }
      catch(e) {
        showAlert('error', `Error loading all ${regionType} regions: ${e.message}`);
        console.error(e);
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
      {REGIONS_ARRAY_NAME !== 'states' && allRegions.states?.map(state => // Highlight states when showing counties
        <GeoJSON key={state.id} data={state.boundary} style={stateStyles}/>
      )}
      {allRegions[REGIONS_ARRAY_NAME]?.map(region => {
        // Give the list's regions a different style
        const regionInList = listRegions?.some(lr => lr.id === region.id);
        return (
          <GeoJSON key={region.id} data={region.boundary} style={regionInList? listStyles : regionStyles} eventHandlers={{click: handleClick}}>
            <Tooltip direction="auto" opacity={.8}>{region.name}</Tooltip>
          </GeoJSON>
        )
      })}
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
      showAlert('error', `Error ${operation.op} ${name} (#${regionID}) ${operation.fromTo} list #${currentList.id}:`, e.message);
    }
  }
}
