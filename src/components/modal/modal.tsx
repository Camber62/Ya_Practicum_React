import React, { FC, ReactNode, useEffect } from 'react';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ReactDOM from 'react-dom';
import styles from './modal.module.scss';
import ModalOverlay from './modal-overlay';

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ title, onClose, children }) => {
  // Обработчик нажатия на Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const modalRoot = document.getElementById('modal-root') as HTMLElement;

  return ReactDOM.createPortal(
    <div className={styles.modal}>
      <ModalOverlay onClose={onClose} />
      <div className={styles.content}>
        {title && (
          <h2 className={`text text_type_main-large ${styles.title}`}>
            {title}
          </h2>
        )}
        <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          <CloseIcon type="primary" />
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;