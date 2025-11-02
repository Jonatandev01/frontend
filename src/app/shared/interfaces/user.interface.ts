export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
}