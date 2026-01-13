import { useMutation } from "@tanstack/react-query";
import { api } from "../../services/api";

interface RegisterUserData {
  nome: string;
  email: string;
  senha: string;
  senhaConfirmation: string;
  funcao?: string;
}

async function registerUser(data: RegisterUserData) {
  const response = await api.post("/usuarios", data);
  return response.data;
}

export function useRegister() {
  return useMutation({ mutationFn: registerUser });
}