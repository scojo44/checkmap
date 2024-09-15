import React from "react"
import {Outlet, useLocation} from "react-router-dom";
import Modal from 'react-modal'

/** Wrapper to show forms as a modal dialog box */

export default function ModalBox({element}) {
  const location = useLocation();
  const previousLocation = location.state?.previousLocation; // Used to tell ModalBox when to be open
  
  // Bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
  Modal.setAppElement('#root');

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0,0,0,50%)',
      zIndex: '9999'
    },
    content: {
      top: '5%',
      bottom: 'auto',
      width: '50%',
      margin: 'auto',
      minWidth: '400px',
      borderRadius: '1rem'
    },
  };

  return (
    <Modal
      isOpen={!!previousLocation}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <Outlet/>
    </Modal>
  );

  function closeModal() {
    // Save in case it's needed
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }
}
