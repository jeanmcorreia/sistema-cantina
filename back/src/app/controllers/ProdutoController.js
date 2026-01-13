import * as Yup from "yup";
import Produto from "../models/Produto.js";

class ProdutoController {

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required("Nome é obrigatório"),
      preco: Yup.number().positive("Preço deve ser positivo").required("Preço é obrigatório"),
      ativo: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Erro de validação" });
    }

    const { nome, preco, ativo } = req.body;

    const produto = await Produto.create({ nome, preco, ativo });

    return res.status(201).json(produto);
  }

  async index(req, res) {
    const produtos = await Produto.findAll();
    return res.json(produtos);
  }

  async show(req, res) {
    const { id } = req.params;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.json(produto);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      preco: Yup.number().positive("Preço deve ser positivo"),
      ativo: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Erro de validação" });
    }

    const { id } = req.params;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    await produto.update(req.body);

    return res.json(produto);
  }

  
  async toggleAtivo(req, res) {
    const { id } = req.params;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    produto.ativo = !produto.ativo;
    await produto.save();

    return res.json({
      message: `Produto ${produto.ativo ? "ativado" : "desativado"}`,
      produto,
    });
  }

  
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "ID não informado" });
      }

      const produto = await Produto.findByPk(id);

      if (!produto) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      

      await produto.destroy();

      return res.json({ message: "Produto removido com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
}

export default new ProdutoController();
