//src/api/auth.ts
import { request } from '../utils/api';

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface RegisterResponse {
  success: boolean;
  user: {
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user: {
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

interface ResetPasswordRequest {
  password: string;
  token: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

interface UpdateProfileRequest {
  name: string;
  email: string;
  password?: string;
}

interface UpdateProfileResponse {
  success: boolean;
  user: {
    email: string;
    name: string;
  };
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

interface RefreshTokenRequest {
  token: string;
}

interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

interface GetUserResponse {
  success: boolean;
  user: {
    email: string;
    name: string;
  };
}

export const register = (data: RegisterRequest) => {
  return request('auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }) as Promise<RegisterResponse>;
};

export const login = (data: LoginRequest) => {
  return request('auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }) as Promise<LoginResponse>;
};

export const forgotPassword = (data: ForgotPasswordRequest) => {
  return request('password-reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }) as Promise<ForgotPasswordResponse>;
};

export const resetPassword = (data: ResetPasswordRequest) => {
  return request('password-reset/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }) as Promise<ResetPasswordResponse>;
};

export const updateProfile = (data: UpdateProfileRequest, token: string) => {
  return request('auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }) as Promise<UpdateProfileResponse>;
};

export const getUser = (token: string) => {
  return request('auth/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }) as Promise<GetUserResponse>;
};

export const logout = (refreshToken: string) => {
  return request('auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshToken }),
  }) as Promise<LogoutResponse>;
};

export const refreshToken = (refreshToken: string) => {
  return request('auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshToken }),
  }) as Promise<RefreshTokenResponse>;
};