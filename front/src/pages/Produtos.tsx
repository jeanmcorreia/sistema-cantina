import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { FaBox } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";

import ToggleSwitch from "../components/toggleSwitch/ToggleSwitch";
import { useProducts } from "../hooks/produto/UseProducts";
import { useToggleAtivo } from "../hooks/produto/UseToggleAtivo";
import { useCreateProduto } from "../hooks/produto/UseCreateProduct";
import { useDeleteProduto } from "../hooks/produto/UseDeleteProduct";
import { useUpdateProduto } from "../hooks/produto/UseUpdateProduct";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import type { Product } from "../interface/product";

// ----------------- validação -----------------
const produtoSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  preco: z
    .string()
    .min(1, "O preço é obrigatório")
    .refine((val) => Number(val) > 0, "O preço deve ser maior que 0"),
  ativo: z.boolean(),
});

type ProdutoSchema = z.infer<typeof produtoSchema>;

// --------------------------------------------------

const Produtos = () => {
  const { data: produtos, isLoading } = useProducts();
  const { mutate: toggleAtivo } = useToggleAtivo();
  const { mutate: createProduto } = useCreateProduto();
  const { mutate: updateProduto } = useUpdateProduto();
  const { mutate: deletarProduto } = useDeleteProduto();

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [produtoEditando, setProdutoEditando] = useState<Product | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<ProdutoSchema>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: "",
      preco: "",
      ativo: true,
    },
  });

  const ativo = useWatch({ control, name: "ativo" });

  if (isLoading) return <p>Carregando...</p>;

  const produtosOrdenados = [...(produtos || [])].sort((a, b) => {
    if (a.ativo && !b.ativo) return -1;
    if (!a.ativo && b.ativo) return 1;
    return a.nome.localeCompare(b.nome, "pt-BR");
  });

  const produtosFiltrados = produtosOrdenados.filter((produto) =>
    produto.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleSalvar = (data: ProdutoSchema) => {
    if (produtoEditando) {
      updateProduto(
        {
          id: produtoEditando.id,
          data: {
            nome: data.nome,
            preco: Number(data.preco),
            ativo: data.ativo,
          },
        },
        {
          onSuccess: () => {
            reset();
            setProdutoEditando(null);
            setOpenModal(false);
          },
        }
      );
      return;
    }

    createProduto(
      {
        nome: data.nome,
        preco: Number(data.preco),
        ativo: data.ativo,
      },
      {
        onSuccess: () => {
          reset();
          setOpenModal(false);
        },
      }
    );
  };

  const abrirModalEdicao = (produto: Product) => {
    setProdutoEditando(produto);
    setValue("nome", produto.nome);
    setValue("preco", String(produto.preco));
    setValue("ativo", produto.ativo);

    setOpenModal(true);
  };

  return (
    <div className="px-7 py-3 flex flex-col relative w-full">
      <button
        onClick={() => {
          reset();
          setProdutoEditando(null);
          setOpenModal(true);
        }}
        className="absolute right-6 top-4 cursor-pointer flex gap-3 bg-blue-600 p-3 rounded-2xl items-center text-white"
      >
        <IoAddOutline />
        <span className="text-[14px]">Novo Produto</span>
      </button>

      <h1 className="font-bold text-2xl">Produtos</h1>
      <p className="text-gray-400 text-[13px]">
        Gerencie os produtos da cantina
      </p>

      <div className="mt-5 relative w-1/3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border border-gray-300 py-0.5 px-7 outline-none placeholder:text-sm w-full"
          placeholder="Buscar produto..."
        />
        <IoIosSearch className="absolute left-1 top-2" />
      </div>

      <div className="mt-15 mb-15 border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-3 text-left bg-gray-100">Nome</th>
              <th className="p-3 text-left bg-gray-100">Preço</th>
              <th className="p-3 text-left bg-gray-100">Status</th>
              <th className="p-3 text-left bg-gray-100">Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtosFiltrados.map((produto) => (
              <tr key={produto.id} className="border-t border-gray-200">
                <td className="py-6 px-3 flex items-center gap-2">
                  <FaBox size={15} />
                  <span className="text-[15px]">{produto.nome}</span>
                </td>

                <td className="py-6 px-3 text-[15px]">
                  R$ {Number(produto.preco || 0).toFixed(2)}
                </td>

                <td className="py-6 px-3 text-[15px]">
                  {produto.ativo ? "Ativo" : "Inativo"}
                </td>

                <td className="py-6 px-3 text-[15px] flex items-center gap-5">
                  <ToggleSwitch
                    value={produto.ativo}
                    onChange={() => toggleAtivo(produto.id)}
                  />

                  <button onClick={() => abrirModalEdicao(produto)}>
                    <FaEdit size={20} className="cursor-pointer" />
                  </button>

                  {/* DELETE FUNCIONANDO */}
                  <button onClick={() => deletarProduto(produto.id)}>
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
            setProdutoEditando(null);
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
                  {produtoEditando ? "Editar Produto" : "Novo Produto"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setProdutoEditando(null);
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

              <label className="text-sm font-medium mt-3 block">
                Preço (R$)
              </label>
              <input
                type="number"
                {...register("preco")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              />
              {errors.preco && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.preco.message}
                </p>
              )}

              <div className="flex justify-between items-center my-4">
                <span className="text-sm font-medium">Produto Ativo</span>
                <ToggleSwitch
                  value={ativo}
                  onChange={() => setValue("ativo", !ativo)}
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setProdutoEditando(null);
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
                  {produtoEditando
                    ? "Salvar Alterações"
                    : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtos;
