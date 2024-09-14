import {useEffect, useState} from 'react'
import CheckMapAPI from '../api'

/** A hook to use the CheckMap API 
 * apiCall: The method in CheckMapAPI to be called
 * args: Any arguments to be passed to the API call
 */

export default function useCheckMapAPI(functionName, ...params) {
  const [data, setData] = useState([]);
  const [apiCall, setApiCall] = useState({functionName, params});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const resp = await CheckMapAPI[apiCall.functionName](...apiCall.params);
        setData(() => resp);
        setError('');
      }
      catch(e) {
        setError(e);
      }
      finally {
        setIsLoading(false);
      }
    }

    if(apiCall.functionName) getData();
  }, [apiCall]);

  function callAPI(functionName, ...params) {
    setApiCall({functionName, params});
  }

  return {data, setApiCall, error, isLoading};
}
