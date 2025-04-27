import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API } from '../api';
import { refreshToken } from '../api/auth';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  authStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
  authError: string | null;
  isAuthChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  authStatus: 'idle',
  authError: null,
  isAuthChecked: false,
};

const requestWithRefresh = async <T>(
  request: (token: string) => Promise<{ user: User }>,
  errorMessage: string
): Promise<User> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) throw new Error('No access token');
    
    const response = await request(accessToken);
    return response.user;
  } catch (error) {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken');
      if (!refreshTokenValue) throw new Error('No refresh token');
      
      const refreshResponse = await refreshToken(refreshTokenValue);
      
      localStorage.setItem('accessToken', refreshResponse.accessToken.replace('Bearer ', ''));
      localStorage.setItem('refreshToken', refreshResponse.refreshToken);
      
      const newAccessToken = localStorage.getItem('accessToken');
      if (!newAccessToken) throw new Error('No access token after refresh');
      
      const response = await request(newAccessToken);
      return response.user;
    } catch (refreshError) {
      throw new Error(errorMessage);
    }
  }
};

// Экшены
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await API.register(data);
      
      localStorage.setItem('accessToken', response.accessToken.replace('Bearer ', ''));
      localStorage.setItem('refreshToken', response.refreshToken);
      
      return response.user;
    } catch (error) {
      return rejectWithValue('Не удалось зарегистрироваться');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await API.login(data);
      
      localStorage.setItem('accessToken', response.accessToken.replace('Bearer ', ''));
      localStorage.setItem('refreshToken', response.refreshToken);
      
      return response.user;
    } catch (error) {
      return rejectWithValue('Не удалось войти');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      
      await API.logout(refreshToken);
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('forgotPasswordRequested');
    } catch (error) {
      return rejectWithValue('Не удалось выйти');
    }
  }
);

export const getUserRequest = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      return await requestWithRefresh(
        (token) => API.getUser(token),
        'Не удалось получить данные пользователя'
      );
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

export const updateUserProfile = createAsyncThunk<User, { name: string; email: string; password?: string }, { rejectValue: string }>(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await requestWithRefresh(
        (token) => API.updateProfile(data, token),
        'Не удалось обновить профиль'
      );
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

// Слайс
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.authError = null;
    },
    
    setAuthError: (state, action: PayloadAction<string>) => {
      state.authStatus = 'failed';
      state.authError = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.authStatus = 'pending';
        state.authError = null;
        state.isAuthChecked = false;
      })
      
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ email: string; name: string }>) => {
        state.user = action.payload;
        state.authStatus = 'succeeded';
        state.authError = null;
        state.isAuthChecked = true;
      })
      
      .addCase(registerUser.rejected, (state, action) => {
        state.authStatus = 'failed';
        state.authError = action.payload as string;
        state.isAuthChecked = true;
      })
      
      // Login
      .addCase(loginUser.pending, (state) => {
        state.authStatus = 'pending';
        state.authError = null;
        state.isAuthChecked = false;
      })
      
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ email: string; name: string }>) => {
        state.user = action.payload;
        state.authStatus = 'succeeded';
        state.authError = null;
        state.isAuthChecked = true;
      })
      
      .addCase(loginUser.rejected, (state, action) => {
        state.authStatus = 'failed';
        state.authError = action.payload as string;
        state.isAuthChecked = true;
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.authStatus = 'pending';
        state.authError = null;
        state.isAuthChecked = false;
      })
      
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.authStatus = 'succeeded';
        state.authError = null;
        state.isAuthChecked = true;
      })
      
      .addCase(logoutUser.rejected, (state, action) => {
        state.authStatus = 'failed';
        state.authError = action.payload as string;
        state.isAuthChecked = true;
      })
      
      // Get User
      .addCase(getUserRequest.pending, (state) => {
        state.authStatus = 'pending';
        state.authError = null;
        state.isAuthChecked = false;
      })
      
      .addCase(getUserRequest.fulfilled, (state, action: PayloadAction<{ email: string; name: string }>) => {
        state.user = action.payload;
        state.authStatus = 'succeeded';
        state.authError = null;
        state.isAuthChecked = true;
      })
      
      .addCase(getUserRequest.rejected, (state, action) => {
        state.authStatus = 'failed';
        state.authError = action.payload as string;
        state.isAuthChecked = true;
      })
      
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.authStatus = 'pending';
        state.authError = null;
        state.isAuthChecked = false;
      })
      
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<{ email: string; name: string }>) => {
        state.user = action.payload;
        state.authStatus = 'succeeded';
        state.authError = null;
        state.isAuthChecked = true;
      })
      
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.authStatus = 'failed';
        state.authError = action.payload as string;
        state.isAuthChecked = true;
      });
  },
});

export const { resetAuthError, setAuthError } = authSlice.actions;
export default authSlice.reducer;