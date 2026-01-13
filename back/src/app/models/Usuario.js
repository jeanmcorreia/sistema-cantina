import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

class Usuario extends Model {
  static init(sequelize) {

    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: { isEmail: true },
        },
        senha: DataTypes.VIRTUAL,
        senha_hash: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        funcao: {
          type: DataTypes.STRING,
          defaultValue: 'usuario',
        },
      },
      {
        sequelize,
        modelName: 'Usuario',
        tableName: 'usuarios',
        underscored: true,
      },
    );

    this.addHook("beforeValidate", async (user) => {
      if (user.senha) {
        user.senha_hash = await bcrypt.hash(user.senha, 8);
      }
    });

    return this;
  }

  checkPassword(senha) {
    return bcrypt.compare(senha, this.senha_hash);
  }
}

export default Usuario;
