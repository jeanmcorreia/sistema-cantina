import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import type { Cliente } from '../../interface/cliente';

type CreateClienteDTO = Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>;

async function createCliente(data: CreateClienteDTO) {
  const response = await api.post('/clientes', data);
  return response.data;
}

export function useCreateCliente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}