import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

import authConfig from "../../config/auth.js"

class SessaoController {
  async create(req, res) {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({
      where: { email },
    });

    if (!usuario) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!(await usuario.checkPassword(senha))) {
      return res.status(401).json({ error: "Password not match" });
    }

    const { id, nome } = usuario;

    return res.json({
      usuario: {
        id,
        nome,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessaoController();