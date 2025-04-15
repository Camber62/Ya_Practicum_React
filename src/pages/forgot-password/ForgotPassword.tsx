import { Button, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';
import { setAuthError } from '../../features/authSlice';
import { AppDispatch } from '../../store';
import styles from './forgot-password.module.scss';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null); // Локальное состояние для ошибок
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null); // Сбрасываем ошибку при изменении поля
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      localStorage.setItem('forgotPasswordRequested', 'true'); // Сохраняем флаг в localStorage
      navigate('/reset-password');
    } catch (error) {
      const errorMessage = 'Не удалось отправить запрос на восстановление пароля';
      setError(errorMessage);
      dispatch(setAuthError(errorMessage)); // Сохраняем ошибку в Redux для других компонентов
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Восстановление пароля</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Укажите e-mail"
          onChange={onEmailChange}
          value={email}
          name="email"
          extraClass={styles.input}
        />
        <Button htmlType="submit" type="primary" size="large" extraClass={styles.button}>
          Восстановить
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