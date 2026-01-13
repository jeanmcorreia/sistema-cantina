export interface Pedido {
  id: number;
  status: "aberto" | "pago" | "cancelado";
  total: number;
  createdAt: string;
  updatedAt: string;

  cliente: {
    id: number;
    nome: string;
  };

  itens: {
    id: number;
    quantidade: number;
    produto: {
      id: number;
      nome: string;
      preco: number;
    };
  }[];
}
