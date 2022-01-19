import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import { SpinnerDotted } from 'spinners-react';

Modal.setAppElement('#root');

const styles = {
  content: {
    top: '50%',
    botton: 'auto',
    left: '50%',
    right: 'auto',
    marginRight: '-40%',
    transform: 'translate(-30%, -80%)'
  }
}
let subtitle;
const ModalSpinner = (props) => {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const { onCloseModal, dataUpdated } = props;
  if (dataUpdated) {
    closeModal();
  }

  useEffect(() => {
    setModalIsOpen(true);
  });

  const afterOpenModal = () => {
    subtitle.style.color = 'black';
  }

  const closeModal = () => {
    setShowSpinner(false);
    setModalIsOpen(false);
    onCloseModal(false);
  }

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={styles}
        contentLabel="Spinner Modal"
      >
        {
          showSpinner &&
          <>
          <h2 className='col' ref={(_subtitle) => (subtitle = _subtitle)}>Cargando...</h2>
          <SpinnerDotted
            size={50}
            thickness={100}
            speed={100}
            color='#36ad47'
            secondarycolor="rgba(0, 0, 0, 0.44)" 
            className="mx-5 my-4"
            />
          </>
        }
        <SpinnerDotted enabled={false} />
      </Modal>
    </>
  )
}

export default ModalSpinner;