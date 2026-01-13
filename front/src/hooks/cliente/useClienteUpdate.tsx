import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';

async function updateCliente({ id, data }: { id: number; data: any }) {
  const response = await api.put(`/clientes/${id}`, data);
  return response.data;
}

export function useUpdateCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}