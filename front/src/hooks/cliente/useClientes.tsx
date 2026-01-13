import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import type { Cliente } from '../../interface/cliente';

async function fetchClientes() {
  const response = await api.get<Cliente[]>('/clientes');
  return response.data;
}

export function useClientes() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: fetchClientes,
  });
}