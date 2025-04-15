import { Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth';
import { setAuthError } from '../../features/authSlice';
import { AppDispatch } from '../../store';
import styles from './reset-password.module.scss';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null); // Локальное состояние для ошибок
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Проверяем флаг в localStorage
  const forgotPasswordRequested = localStorage.getItem('forgotPasswordRequested') === 'true';

  if (!forgotPasswordRequested) {
    return <Navigate to="/forgot-password" replace />;
  }

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null); // Сбрасываем ошибку
  };

  const onTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    setError(null); // Сбрасываем ошибку
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword({ password, token });
      localStorage.removeItem('forgotPasswordRequested'); // Удаляем флаг
      navigate('/login');
    } catch (error) {
      const errorMessage = 'Не удалось сбросить пароль';
      setError(errorMessage);
      dispatch(setAuthError(errorMessage)); // Сохраняем ошибку в Redux
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Восстановление пароля</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <PasswordInput
          onChange={onPasswordChange}
          value={password}
          name="password"
          placeholder="Введите новый пароль"
          extraClass={styles.input}
          icon="ShowIcon"
        />
        <Input
          type="text"
          placeholder="Введите код из письма"
          onChange={onTokenChange}
          value={token}
          name="token"
          extraClass={styles.input}
        />
        <Button htmlType="submit" type="primary" size="large" extraClass={styles.button}>
          Сохранить
        </Button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.text}>
        Вспомнили пароль?{' '}
        <Link to="/login" className={styles.link}>
          Войти
        </Link>
      </p>
    </div>
  );
};