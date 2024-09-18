import React from "react"
import {Outlet} from "react-router-dom";
import Modal from 'react-modal'

/** Wrapper to show forms as a modal dialog box */

export default function ModalBox(props) {
  // Bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
  Modal.setAppElement('#root');

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0,0,0,80%)',
      zIndex: '9999'
    },
    content: {
      top: '10%',
      bottom: 'auto',
      width: '50%',
      margin: 'auto',
      minWidth: '400px',
      borderRadius: '1rem'
    },
  };

  return (
    <Modal
      isOpen={true}
      style={customStyles}
      contentLabel="Modal"
    >
      <Outlet/>
    </Modal>
  );
}
