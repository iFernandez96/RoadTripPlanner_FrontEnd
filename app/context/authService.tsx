import { User, AuthResponse } from './types';

const API_URL = 'https://roadtrip-planner-api-ddd2dd6834e8.herokuapp.com/';

class AuthService {
  private token: string | null;

  constructor() {
    this.token = null;
  }

  async login(email: string, password: string): Promise<AuthResponse | null> {
    try {
      const response = await fetch(`${API_URL}auth/loginPlain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login response:', data);
      this.token = data.access_token;

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async register(username: string, fullname: string, email: string, password: string): Promise<AuthResponse | null> {
    try {
      const response = await fetch(`${API_URL}auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullname, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      this.token = data.access_token;

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }

  setToken(token: string | null): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.token = null;
  }
}

const authService = new AuthService();
export default authService;
