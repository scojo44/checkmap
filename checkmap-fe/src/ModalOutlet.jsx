import React, {useEffect} from "react"
import {Outlet} from "react-router-dom"
import Modal from 'react-modal'
import Alert from "./widgets/Alert"

/** Wrapper to show forms as a modal dialog box */

export default function ModalOutlet({alerts, dismissAlert, clearAlerts = test => test}) {
  // Bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
  Modal.setAppElement('#root');

  useEffect(() => {
    clearAlerts();
  }, []);

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0,0,0,80%)',
      zIndex: '9999'
    },
    content: {
      top: '3.5rem',
      bottom: 'auto',
      width: '50%',
      margin: 'auto',
      padding: '1rem',
      minWidth: '400px',
      borderRadius: '1rem',
      color: 'black',
      backgroundColor: 'rgba(255,255,255,60%)'
    }
  };

  return (
    <Modal
      isOpen={true}
      style={customStyles}
      contentLabel="Modal"
      ariaHideApp={import.meta.env.NODE_ENV !== 'test'} // Suppress appElement warnings during tests
    >
      <Alert alerts={alerts} dismiss={dismissAlert}/>
      <Outlet/>
    </Modal>
  );
}
