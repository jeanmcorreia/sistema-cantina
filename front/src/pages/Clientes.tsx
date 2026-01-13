import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

import { useClientes } from "../hooks/cliente/useClientes";
import { useCreateCliente } from "../hooks/cliente/useCreateCliente";
import { useUpdateCliente } from "../hooks/cliente/useClienteUpdate";
import { useDeleteCliente } from "../hooks/cliente/useClienteDelete";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import type { Cliente } from "../interface/cliente";

// ----------------- validação -----------------
const clienteSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  saldo: z
    .string()
    .refine((val) => Number(val) >= 0, "O saldo não pode ser negativo"),
});

type ClienteSchema = z.infer<typeof clienteSchema>;

// --------------------------------------------------

const Clientes = () => {
  const { data: clientes, isLoading } = useClientes();
  const { mutate: createCliente } = useCreateCliente();
  const { mutate: updateCliente } = useUpdateCliente();
  const { mutate: deletarCliente } = useDeleteCliente();

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClienteSchema>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: "",
      email: "",
      saldo: "",
    },
  });

  if (isLoading) return <p>Carregando...</p>;

  // Ordenação e filtragem
  const clientesOrdenados = [...(clientes || [])].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR")
  );

  const clientesFiltrados = clientesOrdenados.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(search.toLowerCase()) ||
      cliente.email.toLowerCase().includes(search.toLowerCase())
  );

  // SALVAR (CRIAR OU EDITAR)
  const handleSalvar = (data: ClienteSchema) => {
    if (clienteEditando) {
      updateCliente(
        {
          id: clienteEditando.id,
          data: {
            nome: data.nome,
            email: data.email,
            saldo: Number(data.saldo),
          },
        },
        {
          onSuccess: () => {
            reset();
            setClienteEditando(null);
            setOpenModal(false);
          },
        }
      );
      return;
    }

    createCliente(
      {
        nome: data.nome,
        email: data.email,
        saldo: Number(data.saldo),
      },
      {
        onSuccess: () => {
          reset();
          setOpenModal(false);
        },
      }
    );
  };

  const abrirModalEdicao = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setValue("nome", cliente.nome);
    setValue("email", cliente.email);
    setValue("saldo", String(cliente.saldo));

    setOpenModal(true);
  };

  return (
    <div className="px-7 py-3 flex flex-col relative w-full">
      <button
        onClick={() => {
          reset();
          setClienteEditando(null);
          setOpenModal(true);
        }}
        className="absolute right-6 top-4 cursor-pointer flex gap-3 bg-blue-600 p-3 rounded-2xl items-center text-white"
      >
        <IoAddOutline />
        <span className="text-[14px]">Novo Cliente</span>
      </button>

      <h1 className="font-bold text-2xl">Clientes</h1>
      <p className="text-gray-400 text-[13px]">
        Gerencie os clientes da cantina
      </p>

      <div className="mt-5 relative w-1/3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border border-gray-300 py-0.5 px-7 outline-none placeholder:text-sm w-full"
          placeholder="Buscar cliente..."
        />
        <IoIosSearch className="absolute left-1 top-2" />
      </div>

      <div className="mt-15 mb-15 border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-3 text-left bg-gray-100">Nome</th>
              <th className="p-3 text-left bg-gray-100">Email</th>
              <th className="p-3 text-left bg-gray-100">Saldo</th>
              <th className="p-3 text-left bg-gray-100">Ações</th>
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id} className="border-t border-gray-200">
                <td className="py-6 px-3 flex items-center gap-2">
                  <FaUser size={18} />
                  <span className="text-[15px]">{cliente.nome}</span>
                </td>

                <td className="py-6 px-3 text-[15px]">{cliente.email}</td>

                <td className="py-6 px-3 text-[15px]">
                  R$ {Number(cliente.saldo || 0).toFixed(2)}
                </td>

                <td className="py-6 px-3 text-[15px] flex items-center gap-5">
                  <button onClick={() => abrirModalEdicao(cliente)}>
                    <FaEdit size={20} className="cursor-pointer" />
                  </button>

                  <button onClick={() => deletarCliente(cliente.id)}>
                    <RiDeleteBin5Line
                      size={20}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-3"
          onClick={() => {
            reset();
            setClienteEditando(null);
            setOpenModal(false);
          }}
        >
          <div
            className="bg-white w-[350px] p-6 rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit(handleSalvar)}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">
                  {clienteEditando ? "Editar Cliente" : "Novo Cliente"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setClienteEditando(null);
                    setOpenModal(false);
                  }}
                >
                  ✕
                </button>
              </div>

              <label className="text-sm font-medium">Nome</label>
              <input
                type="text"
                {...register("nome")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nome.message}
                </p>
              )}

              <label className="text-sm font-medium mt-3 block">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}

              <label className="text-sm font-medium mt-3 block">Saldo (R$)</label>
              <input
                type="number"
                {...register("saldo")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
              {errors.saldo && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.saldo.message}
                </p>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setClienteEditando(null);
                    setOpenModal(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 cursor-pointer hover:bg-red-600 hover:text-white"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white cursor-pointer"
                >
                  {clienteEditando ? "Salvar Alterações" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
