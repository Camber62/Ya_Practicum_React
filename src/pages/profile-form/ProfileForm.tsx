import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, PasswordInput, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { AppDispatch } from '../../store';

import styles from './profile-form.module.scss';
import { RootState } from '../../store';
import { updateUserProfile } from '../../features/authSlice';

export const ProfileForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, authStatus, authError } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [initialData, setInitialData] = useState({ name: user?.name || '', email: user?.email || '' });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setInitialData({ name: user.name, email: user.email });
    }
  }, [user]);

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
    dispatch(updateUserProfile({ name, email, password }));
  };

  const handleCancel = () => {
    setName(initialData.name);
    setEmail(initialData.email);
    setPassword('');
  };

  const isFormChanged =
    name !== initialData.name || email !== initialData.email || password !== '';

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Имя"
        onChange={onNameChange}
        value={name}
        name="name"
        icon="EditIcon"
        extraClass={styles.input}
        autoComplete="name"
      />
      <Input
        type="email"
        placeholder="Логин"
        onChange={onEmailChange}
        value={email}
        name="email"
        icon="EditIcon"
        extraClass={styles.input}
        autoComplete="email"
      />
      <PasswordInput
        onChange={onPasswordChange}
        value={password}
        name="password"
        placeholder="Пароль"
        icon="EditIcon"
        extraClass={styles.input}
        autoComplete="new-password"
      />
      {authStatus === 'failed' && <p className={styles.error}>{authError}</p>}
      {isFormChanged && (
        <div className={styles.buttons}>
          <Button
            htmlType="button"
            type="secondary"
            size="large"
            extraClass={styles.button}
            onClick={handleCancel}
          >
            Отмена
          </Button>
          <Button htmlType="submit" type="primary" size="large" extraClass={styles.button}>
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};