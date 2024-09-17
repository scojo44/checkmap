import React, {useEffect, useState} from "react"

export default function useLocalStorageState(key, initialState) {
  const savedState = localStorage.getItem(key);

  try {
    if(savedState)
      initialState = JSON.parse(savedState);
  }
  catch(error) {}

  const [state, setState] = useState(initialState);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setLocalStorageState];

  // Set the new state or delete it from locatStorage if null or undefined.
  function setLocalStorageState(newState) {
    if(newState === null || newState === undefined)
      localStorage.removeItem(key);
    setState(() => newState);
  }
}
