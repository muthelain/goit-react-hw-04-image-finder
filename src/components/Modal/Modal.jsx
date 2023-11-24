import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Overlay, ModalStyled } from './Modal.styled';

export function Modal({modalClose, largeImg, tags}){
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      modalClose();
    }
  };

  const onClickModalClose = e => {
    if (e.target === e.currentTarget) {
      modalClose();
    }
  };


    return (
      <Overlay onClick={onClickModalClose}>
        <ModalStyled>
          <img src={largeImg} alt={tags} />
        </ModalStyled>
      </Overlay>
    );
  }


Modal.propTypes = {
  modalClose: PropTypes.func.isRequired,
  largeImg: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
};