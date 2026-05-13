import React from 'react';
import ReactModal from 'react-modal';

if (typeof document !== 'undefined') {
    ReactModal.setAppElement(document.getElementById('root') || document.body);
}

const Modal = ({ isOpen, onRequestClose, children, title }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      className='bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-auto my-20 outline-none'
      overlayClassName='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
    >
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>{title}</h2>
        <button onClick={onRequestClose} className='text-gray-500 hover:text-gray-800'>&times;</button>
      </div>
      {children}
    </ReactModal>
  );
};

export default Modal;
