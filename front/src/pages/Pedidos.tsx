import React, { useMemo, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import {FaMoneyBillWave } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useWatch } from "react-hook-form";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { usePedidos } from "../hooks/pedido/usePedidos";
import { useCreatePedido } from "../hooks/pedido/useCreatePedido";
import { usePagarPedido } from "../hooks/pedido/usePagarPedido";
import { useCancelarPedido } from "../hooks/pedido/useCancelarPedido";
import { useProducts } from "../hooks/produto/UseProducts";
import { useClientes } from "../hooks/cliente/useClientes";

import type { Pedido } from "../interface/pedido";
import type { Product } from "../interface/product";
import type { Cliente } from "../interface/cliente";

const itemPedidoSchema = z.object({
  produtoId: z.number().min(1, "Selecione um produto"),
  produtoNome: z.string().min(1),
  produtoPreco: z.string(),
  quantidade: z.number().min(1, "Mín. 1 item"),
});

const pedidoSchema = z.object({
  clienteId: z.number().min(1, "Selecione um cliente"),
  itens: z.array(itemPedidoSchema).min(1, "O pedido precisa ter ao menos 1 item"),
});

type PedidoSchema = z.infer<typeof pedidoSchema>;

const Pedidos = () => {
  const [statusFiltro, setStatusFiltro] = useState<Pedido["status"] | "">("");
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const { data: pedidos, isLoading: isLoadingPedidos } = usePedidos(statusFiltro || undefined);
  const { data: produtos, isLoading: isLoadingProdutos } = useProducts();
  const { data: clientes, isLoading: isLoadingClientes } = useClientes();

  const { mutate: createPedido, isPending: creating } = useCreatePedido();
  const { mutate: pagarPedido, isPending: paying } = usePagarPedido();
  const { mutate: cancelarPedido, isPending: cancelling } = useCancelarPedido();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PedidoSchema>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      clienteId: 0,
      itens: [],
    },
  });

  console.log(errors)

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itens",
  });

  const watchedItens = useWatch({
  control,
  name: "itens",
});

console.log(watchedItens)

  // TOTAL calculado com segurança
  const totalPedido = useMemo(
    () =>
      watchedItens?.reduce(
        (acc, it) => acc + (Number(it?.produtoPreco) || 0) * (Number(it?.quantidade) || 0),
        0
      ) ?? 0,
    [watchedItens]
  );

  if (isLoadingPedidos || isLoadingProdutos || isLoadingClientes) return <p>Carregando...</p>;

  const pedidosFiltrados = (pedidos || []).filter((pedido) => {
    const clienteNome = pedido.cliente?.nome ?? "";
    const itensResumo = (pedido.itens || [])
      .map((ip) => `${ip.produto?.nome ?? ""}`)
      .join(" ");
    const termo = search.trim().toLowerCase();
    if (!termo) return true;

    return (
      String(pedido.id).includes(termo) ||
      clienteNome.toLowerCase().includes(termo) ||
      (pedido.status ?? "").toLowerCase().includes(termo) ||
      itensResumo.toLowerCase().includes(termo)
    );
  });

  const onSalvar = (data: PedidoSchema) => {
    console.log('onSalvar')
    const payload = {
      clienteId: data.clienteId,
      itens: data.itens.map((it) => ({
        produtoId: it.produtoId,
        quantidade: it.quantidade,
      })),
    };

    createPedido(payload, {
      onSuccess: () => {
        reset({ clienteId: 0, itens: [] });
        setOpenModal(false);
      },
      onError: (err: any) => {
        console.error("Erro criar pedido:", err);
        alert(err?.response?.data?.error || "Erro ao criar pedido");
      },
    });
  };

  const handlePagar = (pedidoId: number) => {
    if (!window.confirm("Marcar este pedido como PAGO?")) return;

    pagarPedido(pedidoId, {
      onSuccess: () => alert("Pedido marcado como PAGO."),
      onError: (err: any) => {
        console.error("Erro ao pagar:", err);
        alert(err?.response?.data?.error || "Erro ao pagar pedido");
      },
    });
  };

  const handleCancelar = (pedidoId: number) => {
    if (!window.confirm("Deseja realmente cancelar este pedido?")) return;

    cancelarPedido(pedidoId, {
      onSuccess: () => alert("Pedido cancelado."),
      onError: (err: any) => {
        console.error("Erro ao cancelar:", err);
        alert(err?.response?.data?.error || "Erro ao cancelar pedido");
      },
    });
  };

  const handleAdicionarItem = () => {
    append({
      produtoId: 0,
      produtoNome: "",
      produtoPreco: 0,
      quantidade: 1,
    });
  };

  const handleProdutoChange = (index: number, produtoId: number) => {
    const produto = produtos?.find((p) => p.id === produtoId);
    if (!produto) {
      setValue(`itens.${index}.produtoId`, 0);
      setValue(`itens.${index}.produtoNome`, "");
      setValue(`itens.${index}.produtoPreco`, 0);
      return;
    }

    setValue(`itens.${index}.produtoId`, produto.id);
    setValue(`itens.${index}.produtoNome`, produto.nome);
    setValue(`itens.${index}.produtoPreco`, produto.preco);
  };

  return (
    <div className="px-7 py-3 flex flex-col relative w-full">
      <button
        onClick={() => {
          reset({ clienteId: 0, itens: [] });
          setOpenModal(true);
        }}
        className="absolute right-6 top-4 cursor-pointer flex gap-3 bg-blue-600 p-3 rounded-2xl items-center text-white"
      >
        <IoAddOutline />
        <span className="text-[14px]">Novo Pedido</span>
      </button>

      <h1 className="font-bold text-2xl">Pedidos</h1>
      <p className="text-gray-400 text-[13px]">Gerencie os pedidos da cantina</p>

      <div className="mt-5 flex gap-4 items-center">
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value as Pedido["status"] | "")}
          className="rounded border border-gray-300 py-1 px-3 outline-none text-sm"
        >
          <option value="">Todos</option>
          <option value="aberto">Aberto</option>
          <option value="pago">Pago</option>
          <option value="cancelado">Cancelado</option>
        </select>

        <div className="relative w-1/3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded border border-gray-300 py-0.5 px-7 outline-none placeholder:text-sm w-full"
            placeholder="Buscar pedido por ID, cliente ou produto..."
          />
          <IoIosSearch className="absolute left-1 top-2" />
        </div>
      </div>

      {/* TABELA */}
      <div className="mt-8 mb-15 border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-3 text-left bg-gray-100">Pedido</th>
              <th className="p-3 text-left bg-gray-100">Cliente</th>
              <th className="p-3 text-left bg-gray-100">Itens</th>
              <th className="p-3 text-left bg-gray-100">Total</th>
              <th className="p-3 text-left bg-gray-100">Status</th>
              <th className="p-3 text-left bg-gray-100">Data</th>
              <th className="p-3 text-left bg-gray-100">Ações</th>
            </tr>
          </thead>

          <tbody>
            {pedidosFiltrados.map((pedido) => {
              const status = pedido.status ?? "indefinido";

              return (
                <tr key={pedido.id} className="border-t border-gray-200">
                  <td className="py-6 px-3 text-[15px]">#{pedido.id}</td>

                  <td className="py-6 px-3 text-[15px]">
                    {pedido.cliente?.nome ?? "N/A"}
                  </td>

                  <td className="py-6 px-3 text-[15px]">
                    <div>
                      <div className="text-sm text-gray-600">
                        {pedido.itens?.length ?? 0} item(s)
                      </div>
                      
                    </div>
                  </td>

                  {/* TOTAL corrigido */}
                  <td className="py-6 px-3 text-[15px] font-semibold">
                    R$ {(Number(pedido.total) || 0).toFixed(2)}
                  </td>

                  <td className="py-6 px-3 text-[15px]">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs ${
                        status === "aberto"
                          ? "bg-yellow-500"
                          : status === "pago"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {status.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-6 px-3 text-[15px]">
                    {new Date(pedido.createdAt).toLocaleString()}
                  </td>

                  <td className="py-6 px-3 text-[15px] flex items-center gap-4">

                    {status === "aberto" && (
                      <>
                        <button
                          title="Marcar como Pago"
                          onClick={() => handlePagar(pedido.id)}
                        >
                          <FaMoneyBillWave
                            size={18}
                            className="cursor-pointer text-green-500 hover:text-green-700"
                          />
                        </button>

                        <button
                          title="Cancelar Pedido"
                          onClick={() => handleCancelar(pedido.id)}
                        >
                          <RiDeleteBin5Line
                            size={18}
                            className="cursor-pointer text-red-500 hover:text-red-700"
                          />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-3"
          onClick={() => {
            reset({ clienteId: 0, itens: [] });
            setOpenModal(false);
          }}
        >
          <div
            className="bg-white w-[600px] p-6 rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit(onSalvar)}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Novo Pedido</h2>
                <button
                  type="button"
                  onClick={() => {
                    reset({ clienteId: 0, itens: [] });
                    setOpenModal(false);
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Cliente */}
              <label className="text-sm font-medium">Cliente</label>
              <Controller
                control={control}
                name="clienteId"
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  >
                    <option value={0}>Selecione um cliente</option>
                    {clientes?.map((c: Cliente) => (
                      <option key={c.id} value={c.id}>
                        {c.nome} — R$ {Number(c.saldo ?? 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.clienteId && (
                <p className="text-red-500 text-sm mt-1">{errors.clienteId.message}</p>
              )}

              <h3 className="font-semibold text-md mt-6 mb-2">Itens do Pedido</h3>
              <button
                type="button"
                onClick={handleAdicionarItem}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <IoAddOutline /> Adicionar Item
              </button>

              <div className="max-h-60 overflow-y-auto mt-2 space-y-3 p-2 border border-gray-200 rounded-lg">
                {fields.map((f, idx) => (
                  <div key={f.id} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Controller
                        control={control}
                        name={`itens.${idx}.produtoId`}
                        render={() => (
                          <select
                            value={watchedItens?.[idx]?.produtoId ?? 0}
                            onChange={(e) => handleProdutoChange(idx, Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value={0}>Selecione um Produto</option>
                            {produtos
                              ?.filter((p: Product) => p.ativo)
                              .map((p: Product) => (
                                <option key={p.id} value={p.id}>
                                  {p.nome} - R$ {Number(p.preco).toFixed(2)}
                                </option>
                              ))}
                          </select>
                        )}
                      />
                      {errors.itens?.[idx]?.produtoId && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.itens?.[idx]?.produtoId?.message}
                        </p>
                      )}
                    </div>

                    <div className="w-1/4">
                      <input
                        type="number"
                        {...register(`itens.${idx}.quantidade`, { valueAsNumber: true })}
                        min={1}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                      {errors.itens?.[idx]?.quantidade && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.itens?.[idx]?.quantidade?.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <RiDeleteBin5Line size={18} />
                    </button>
                  </div>
                ))}

                {fields.length === 0 && (
                  <p className="text-gray-500 text-sm">Adicione produtos ao pedido.</p>
                )}
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="font-bold text-xl">
                  Total: R$ {totalPedido.toFixed(2)}
                </span>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      reset({ clienteId: 0, itens: [] });
                      setOpenModal(false);
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                    disabled={creating}
                  >
                    {creating ? "Criando..." : "Criar Pedido"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;
