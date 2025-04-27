import { getIngredients } from './ingredients';
import { placeOrder } from './orders';
import { register, login, forgotPassword, resetPassword, updateProfile, getUser, logout, refreshToken } from './auth';

export const API = {
  getIngredients,
  createOrder: placeOrder,
  register,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  getUser,
  logout,
  refreshToken,
};