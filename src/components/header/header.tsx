import React from 'react';
import styles from './header.module.scss';
import { BurgerIcon, ListIcon, ProfileIcon, Logo } from '@ya.praktikum/react-developer-burger-ui-components';

const Header: React.FC = () => {
	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
				<div className={styles.navLeft}>
					<a href="#" className={`${styles.navItem} pl-5 pr-5 pt-4 pb-4`}>
						<BurgerIcon type="primary" />
						<p className={`text text_type_main-default pl-2 ${styles.activeText}`}>
							Конструктор
						</p>
					</a>

					<a href="#" className={`${styles.navItem} pl-5 pr-5 pt-4 pb-4`}>
						<ListIcon type="secondary" />
						<p className="text text_type_main-default pl-2 text_color_inactive">Лента заказов</p>
					</a>
				</div>

				<div className={styles.logo}>
					<Logo />
				</div>

				<a href="#" className={`${styles.navItem} pl-5 pr-5 pt-4 pb-4`}>
					<ProfileIcon type="secondary" />
					<p className="text text_type_main-default pl-2 text_color_inactive">Личный кабинет</p>
				</a>
			</nav>
		</header>
	);
};

export default Header;