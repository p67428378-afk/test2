import React from 'react';
import ReactModal from 'react-modal';

// Per constitution, set app element in a safe way
if (typeof document !== 'undefined') {
  ReactModal.setAppElement(document.getElementById('root') || document.body);
}

const Modal = ({ isOpen, onRequestClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        },
        content: {
          position: 'relative',
          inset: 'auto',
          border: 'none',
          background: 'transparent',
          overflow: 'visible',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '0',
          outline: 'none',
          padding: '0',
        },
      }}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
