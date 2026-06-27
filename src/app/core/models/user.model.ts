export interface AuthUser {
  userId: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  email: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}
