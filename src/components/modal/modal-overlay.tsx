import React, { FC } from 'react';
import styles from './modal-overlay.module.scss';

interface ModalOverlayProps {
	onClose: () => void;
}

const ModalOverlay: FC<ModalOverlayProps> = ({ onClose }) => {
	return <div className={styles.overlay} onClick={onClose}></div>;
};

export default ModalOverlay;