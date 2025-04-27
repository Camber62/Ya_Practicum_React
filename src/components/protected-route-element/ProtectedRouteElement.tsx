import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedProps {
  onlyUnAuth?: boolean;
  component: React.ReactElement;
}

const Protected: React.FC<ProtectedProps> = ({ onlyUnAuth = false, component }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthChecked = useSelector((state: RootState) => state.auth.isAuthChecked);
  const location = useLocation();

  // Если проверка авторизации ещё не завершена, показываем загрузку
  if (!isAuthChecked) {
    return <p>Loading...</p>;
  }

  // Для авторизованного маршрута, но пользователь не авторизован
  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Для неавторизованного маршрута, но пользователь авторизован
  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  // Случаи, когда:
  // - onlyUnAuth && !user (для неавторизованного и не авторизован)
  // - !onlyUnAuth && user (для авторизованного и авторизован)
  return component;
};

// Экспортируем два компонента для удобства
export const OnlyAuth = Protected;

export const OnlyUnAuth: React.FC<{ component: React.ReactElement }> = ({ component }) => (
  <Protected onlyUnAuth component={component} />
);