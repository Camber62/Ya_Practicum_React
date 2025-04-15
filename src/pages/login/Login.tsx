import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './login.module.scss';
import { RootState, AppDispatch } from '../../store';
import { loginUser } from '../../features/authSlice';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { authStatus, authError } = useSelector((state: RootState) => state.auth);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/profile');
      }
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Вход</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="E-mail"
          onChange={onEmailChange}
          value={email}
          name="email"
          extraClass={styles.input}
        />
        <PasswordInput
          onChange={onPasswordChange}
          value={password}
          name="password"
          extraClass={styles.input}
          icon="ShowIcon"
        />
        <Button htmlType="submit" type="primary" size="large" extraClass={styles.button}>
          Войти
        </Button>
      </form>
      {authStatus === 'failed' && <p className={styles.error}>{authError}</p>}
      <p className={styles.text}>
        Вы — новый пользователь?{' '}
        <Link to="/register" className={styles.link}>
          Зарегистрироваться
        </Link>
      </p>
      <p className={styles.text}>
        Забыли пароль?{' '}
        <Link to="/forgot-password" className={styles.link}>
          Восстановить пароль
        </Link>
      </p>
    </div>
  );
};