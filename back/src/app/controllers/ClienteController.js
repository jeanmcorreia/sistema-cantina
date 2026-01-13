import * as Yup from 'yup';
import Cliente from '../models/Cliente.js';

class ClienteController {
  async register(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required('Nome é obrigatório'),
      email: Yup.string()
        .email('E-mail inválido')
        .required('E-mail é obrigatório'),
      saldo: Yup.number().min(0, 'Saldo não pode ser negativo'),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação dos dados.' });
    }

    const { nome, email, saldo } = req.body;

    const clienteExiste = await Cliente.findOne({ where: { email } });
    if (clienteExiste) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    const { id, createdAt, updatedAt } = await Cliente.create({
      nome,
      email,
      saldo : Number(saldo),
    });

    return res
      .status(201)
      .json({ id, nome, email, saldo, createdAt, updatedAt });
  }

  
  async index(req, res) {
    const clientes = await Cliente.findAll({
      attributes: ['id', 'nome', 'email', 'saldo', 'createdAt'],
    });

    return res.json(clientes);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email('Email inválido'),
      saldo: Yup.number().min(0),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Erro na validação' });

    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    if (req.body.email && req.body.email !== cliente.email) {
      const existe = await Cliente.findOne({
        where: { email: req.body.email },
      });
      if (existe) {
        return res.status(400).json({ error: 'E-mail já está em uso' });
      }
    }

    await cliente.update(req.body);

    return res.json({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      saldo: Number(req.body.saldo),
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    await cliente.destroy();

    return res.json({ message: 'Cliente removido com sucesso' });
  }
}

export default new ClienteController();
