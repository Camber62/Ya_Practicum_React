import Header from '@components/header/header';
import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAppDispatch, useAppSelector } from '../store';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { fetchIngredients, setSelectedIngredient } from '../features/appSlice';
import HomePage from '../pages/home/Home';
import { Login } from '../pages/login/Login';
import { Register } from '../pages/register/Register';
import { ResetPassword } from '../pages/reset-password/ResetPassword';
import { ForgotPassword } from '@pages/forgot-password/ForgotPassword';
import { ProfileForm } from '@pages/profile-form/ProfileForm';
import { Profile } from '@pages/profile/Profile';
import { Ingredient } from '../pages/ingredient/Ingredient';
import { getUserRequest } from '../features/authSlice';
import IngredientDetails from '@components/ingredient-details/ingredient-details';
import Modal from '@components/modal/modal';
import { OnlyAuth, OnlyUnAuth } from '@components/protected-route-element/ProtectedRouteElement';
import OrderFeed from '../components/order-feed/OrderFeed';
import OrderDetailsContainer from '../components/order-feed/OrderDetailsContainer';
import ProfileOrdersFeed from '../components/order-feed/ProfileOrdersFeed';

const AppRouter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { ingredients, ingredientsStatus, ingredientsError, selectedIngredient } = useAppSelector((state) => state.app);

  // Извлекаем background только из location.state
  const background = location.state?.background;

  useEffect(() => {
    const ingredientId = location.pathname.split('/ingredients/')[1];
    if (ingredientId && ingredientsStatus === 'succeeded' && !selectedIngredient) {
      const ingredient = ingredients.find((item) => item._id === ingredientId);
      console.log('AppRouter: found ingredient=', ingredient); // Временный лог для отладки
      if (ingredient) {
        dispatch(setSelectedIngredient(ingredient));
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, ingredients, ingredientsStatus, selectedIngredient, dispatch, navigate]);

  // Обработка ошибок загрузки ингредиентов
  useEffect(() => {
    if (ingredientsStatus === 'failed') {
      console.error('Failed to load ingredients:', ingredientsError);
      navigate('/', { replace: true });
    }
  }, [ingredientsStatus, ingredientsError, navigate]);

  const handleCloseModal = () => {
    dispatch(setSelectedIngredient(null));
    navigate(background?.pathname || '/', { replace: true });
  };

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/ingredients/:id"
          element={
            ingredientsStatus === 'pending' ? (
              <div>Загрузка...</div>
            ) : background ? (
              // Если есть background, рендерим HomePage и модальное окно
              <>
                <HomePage />
                {selectedIngredient ? (
                  <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                    <IngredientDetails />
                  </Modal>
                ) : (
                  <div>Ингредиент не найден</div>
                )}
              </>
            ) : (
              // Если нет background, рендерим страницу ингредиента
              <Ingredient />
            )
          }
        />
        <Route path="/feed" element={<OrderFeed />} />
        <Route path="/feed/:number" element={<OrderDetailsContainer source="feed" />} />
        <Route path="/login" element={<OnlyUnAuth component={<Login />} />} />
        <Route path="/register" element={<OnlyUnAuth component={<Register />} />} />
        <Route path="/forgot-password" element={<OnlyUnAuth component={<ForgotPassword />} />} />
        <Route path="/reset-password" element={<OnlyUnAuth component={<ResetPassword />} />} />
        <Route path="/profile" element={<OnlyAuth component={<Profile />} />}>
          <Route index element={<ProfileForm />} />
          <Route path="orders" element={<ProfileOrdersFeed />} />
          <Route path="orders/:number" element={<OrderDetailsContainer source="profileOrders" />} />
        </Route>
      </Routes>
      {background && (
        <Routes>
          <Route path="/feed/:number" element={<Modal onClose={() => navigate(-1)}><OrderDetailsContainer source="feed" /></Modal>} />
          <Route path="/profile/orders/:number" element={<Modal onClose={() => navigate(-1)}><OrderDetailsContainer source="profileOrders" /></Modal>} />
        </Routes>
      )}
    </>
  );
};

export const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(getUserRequest());
  }, [dispatch]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="page">
        <Header />
        <AppRouter />
      </div>
    </DndProvider>
  );
};

export default App;