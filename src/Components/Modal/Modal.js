import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import propTypes from 'prop-types';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

function Modal({ onClose, source, children }) {
  const handleKeyDown = event => {
    if (event.code === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return createPortal(
    <div className={s.backdrop} onClick={handleBackdropClick}>
      <div className={s.content} source={source}>
        {children}
      </div>
    </div>,
    modalRoot,
  );
}

Modal.propTypes = {
  source: propTypes.string.isRequired,
  onClose: propTypes.func.isRequired,
};

export default Modal;
