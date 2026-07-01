export type LoginRequest = {
  nombreUsuario: string;
  contrasena: string;
};

export type LoginResponse = {
  bearerToken: string;
  expiresIn: string;
};
