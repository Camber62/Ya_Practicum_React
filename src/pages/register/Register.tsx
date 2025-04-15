import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Input, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './register.module.scss';
import { RootState, AppDispatch } from '../../store';
import { registerUser } from '../../features/authSlice';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { authStatus, authError } = useSelector((state: RootState) => state.auth);

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser({ email, password, name }))
      .unwrap()
      .then(() => {
        navigate('/');
      });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Регистрация</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Имя"
          onChange={onNameChange}
          value={name}
          name="name"
          extraClass={styles.input}
        />
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
          Зарегистрироваться
        </Button>
      </form>
      {authStatus === 'failed' && <p className={styles.error}>{authError}</p>}
      <p className={styles.text}>
        Уже зарегистрированы?{' '}
        <Link to="/login" className={styles.link}>
          Войти
        </Link>
      </p>
    </div>
  );
};