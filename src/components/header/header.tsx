import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BurgerIcon, ListIcon, ProfileIcon, Logo } from '@ya.praktikum/react-developer-burger-ui-components';
import { useSelector } from 'react-redux'; // Add useSelector to access Redux state
import { RootState } from '../../store'; // Import RootState for typing
import styles from './header.module.scss';

const Header: React.FC = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth); // Get user from auth slice

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navItem} pl-5 pr-5 pt-4 pb-4 ${isActive ? styles.active : ''}`
            }
          >
            <BurgerIcon type={location.pathname === '/' ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default pl-2 ${
                location.pathname === '/' ? styles.activeText : 'text_color_inactive'
              }`}
            >
              Конструктор
            </p>
          </NavLink>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `${styles.navItem} pl-5 pr-5 pt-4 pb-4 ${isActive ? styles.active : ''}`
            }
          >
            <ListIcon type={location.pathname === '/feed' ? 'primary' : 'secondary'} />
            <p
              className={`text text_type_main-default pl-2 ${
                location.pathname === '/feed' ? styles.activeText : 'text_color_inactive'
              }`}
            >
              Лента заказов
            </p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.navItem} pl-5 pr-5 pt-4 pb-4 ${isActive ? styles.active : ''}`
          }
        >
          <ProfileIcon type={location.pathname.startsWith('/profile') ? 'primary' : 'secondary'} />
          <p
            className={`text text_type_main-default pl-2 ${
              location.pathname.startsWith('/profile') ? styles.activeText : 'text_color_inactive'
            }`}
          >
            {user ? user.email : 'Личный кабинет'} {/* Show email if user is authenticated */}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;