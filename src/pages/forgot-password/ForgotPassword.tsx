import { Button, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import React, { useState } from 'react';
import { useAppDispatch } from '../../store';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';
import { setAuthError } from '../../features/authSlice';
import { AppDispatch } from '../../store';
import { useForm } from '../../hooks/useForm';
import styles from './forgot-password.module.scss';

export const ForgotPassword: React.FC = () => {
  const [form, handleChange] = useForm({ email: '' });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email: form.email });
      localStorage.setItem('forgotPasswordRequested', 'true');
      navigate('/reset-password');
    } catch (error) {
      const errorMessage = 'Не удалось отправить запрос на восстановление пароля';
      setError(errorMessage);
      dispatch(setAuthError(errorMessage));
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Восстановление пароля</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Укажите e-mail"
          onChange={handleChange}
          value={form.email}
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