import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

interface LoginUserData {
  email: string;
  senha: string;
}

async function loginUser(data: LoginUserData) {
  const response = await api.post("/sessions", data);
  return response.data;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries({ queryKey: ["usuario"] });
    },
  });
}