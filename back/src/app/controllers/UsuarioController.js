import * as Yup from 'yup';
import Usuario from '../models/Usuario.js';

class UsuarioController {
  async register(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required('Nome é obrigatório'),
      email: Yup.string()
        .email('E-mail inválido')
        .required('E-mail é obrigatório'),
      senha: Yup.string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .required('Senha é obrigatória'),
      senhaConfirmation: Yup.string().when('senha', (senha, field) =>
        senha
          ? field
              .required('Confirmação de senha é obrigatória')
              .oneOf([Yup.ref('senha')], 'As senhas devem coincidir')
          : field,
      ),
      funcao: Yup.string(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { nome, email, senha, funcao } = req.body;

    const usuarioExiste = await Usuario.findOne({ where: { email } });
    if (usuarioExiste) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    const { id, createdAt, updatedAt } = await Usuario.create({
      nome,
      email,
      senha,
      funcao: funcao || 'usuario',
    });

    return res
      .status(201)
      .json({ id, nome, email, funcao, createdAt, updatedAt });
  }


  async index(req, res) {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nome', 'email', 'funcao', 'createdAt'],
    });

    return res.json(usuarios);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email('Email inválido'),
      senha: Yup.string().min(6),
      funcao: Yup.string(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Erro na validação' });

    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (req.body.email && req.body.email !== usuario.email) {
      const existe = await Usuario.findOne({
        where: { email: req.body.email },
      });
      if (existe) {
        return res.status(400).json({ error: 'E-mail já está em uso' });
      }
    }

    await usuario.update(req.body);

    return res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      funcao: usuario.funcao,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await usuario.destroy();

    return res.json({ message: 'Usuário removido com sucesso' });
  }
}

export default new UsuarioController();
