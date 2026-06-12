import { saveSession } from "../auth/sessionAuth";

type LoginRequest = {
  username: string;
  password: string;
};

export async function loginUser(request: LoginRequest): Promise<void> {
  await new Promise((r) => setTimeout(r, 600));

  if (request.username !== "admin" || request.password !== "1234") {
    throw new Error("Credenciales incorrectas");
  }

  
  const fakeToken = "fake.jwt.token";
  const fakeRoles = ["ADMIN"]; 

  saveSession(fakeToken, fakeRoles);
}