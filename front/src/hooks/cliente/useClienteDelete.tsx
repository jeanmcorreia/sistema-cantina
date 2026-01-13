import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';

async function deleteCliente(id: number) {
  const response = await api.delete(`/clientes/${id}`);
  return response.data;
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}
