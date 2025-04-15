import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './profile.module.scss';
import { RootState, AppDispatch } from '../../store';
import { getUserRequest, logoutUser } from '../../features/authSlice';

export const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, authStatus } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getUserRequest());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logoutUser()).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/login');
      }
    });
  };

  if (authStatus === 'pending') {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          Профиль
        </NavLink>
        <NavLink
          to="/profile/orders"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          История заказов
        </NavLink>
        <button onClick={handleLogout} className={styles.link}>
          Выход
        </button>
        <p className={styles.description}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};