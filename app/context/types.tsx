export interface User {
  username: string;
  email: string;
  fullname?: string;
  id?: string;
}

export interface JwtPayload {
  userId?: string;
  email: string;
  issuedAtTimestamp: number;
  expirationTimestamp: number;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: User;
}
