import React, { FC } from 'react';
import styles from './modal-overlay.module.scss';

interface ModalOverlayProps {
  onClose: () => void;
}

const ModalOverlay: FC<ModalOverlayProps> = ({ onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Убедимся, что клик произошёл именно на оверлее, а не на дочерних элементах
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return <div className={styles.overlay} onClick={handleOverlayClick}></div>;
};

export default ModalOverlay;