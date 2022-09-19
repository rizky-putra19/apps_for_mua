export interface RegisterUser {
  email: string;
  phoneToken: string;
  name?: string;
  password?: string;
  facebookId?: string;
  googleId?: string;
  type: string;
}
