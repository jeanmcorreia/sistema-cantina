import { api } from "../../services/api";
import { useQuery } from "@tanstack/react-query";

import type { Pedido } from "../../interface/pedido";

async function fetchPedidos(status?: Pedido['status']) {
  const params = status ? { status } : {};
  const response = await api.get<Pedido[]>('/pedidos', { params });
  return response.data;
}

export function usePedidos(status?: Pedido['status']) {
  return useQuery({
    queryKey: ['pedidos', status],
    queryFn: () => fetchPedidos(status),
  });
}
