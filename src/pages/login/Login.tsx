import React, { FC, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginUser, selectIsAuthenticated } from '../../features/authSlice';
import { Button, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './login.module.scss';

export const Login: FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { authError } = useAppSelector((state) => state.auth);
  const from = location.state?.from?.pathname || '/';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className={styles.container}>
      <h2 className="text text_type_main-medium mb-6">Вход</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className="mb-6">
          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!authError}
            errorText={authError || undefined}
            required
          />
        </div>
        <div className="mb-6">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={showPassword ? 'HideIcon' : 'ShowIcon'}
            onIconClick={() => setShowPassword(!showPassword)}
            error={!!authError}
            errorText={authError || undefined}
            required
          />
        </div>
        <Button type="primary" size="medium" htmlType="submit">
          Войти
        </Button>
      </form>
      <div className={`${styles.links} mt-20`}>
        <p className="text text_type_main-default text_color_inactive">
          Вы — новый пользователь?{' '}
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </p>
        <p className="text text_type_main-default text_color_inactive">
          Забыли пароль?{' '}
          <Link to="/forgot-password" className={styles.link}>
            Восстановить пароль
          </Link>
        </p>
      </div>
    </div>
  );
};