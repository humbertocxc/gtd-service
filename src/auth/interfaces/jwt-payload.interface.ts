export interface JwtPayload {
  sub: string;
  name: string;
  role: string;
}

export interface UserFromJwt {
  id: string;
  name: string;
  role: string;
}
