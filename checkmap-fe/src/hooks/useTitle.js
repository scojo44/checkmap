import {useContext, useEffect} from 'react'
import UserContext from '../UserContext'

export default function useTitle(pageTitle) {
  const {SITE_NAME} = useContext(UserContext);

  useEffect(() => {
    if(!pageTitle) return; // Do nothing if undefined

    const prevTitle = document.title;

    document.title = `${pageTitle} - ${SITE_NAME}`;
    return () => {
      document.title = prevTitle;
    };
  });
}
