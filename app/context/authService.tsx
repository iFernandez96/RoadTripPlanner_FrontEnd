class AuthService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = 'https://roadtrip-planner-api-ddd2dd6834e8.herokuapp.com';
    this.token = null;
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/loginPlain`, {
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
      this.token = data.access_token || data.token;

      return this.token;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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