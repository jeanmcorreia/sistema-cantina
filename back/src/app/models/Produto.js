import { Model, DataTypes } from "sequelize";

class Produto extends Model {
  static init(sequelize) {
    return super.init(
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
        preco: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        ativo: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: "Produto",
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.Pedido, { through: models.ItemPedido });
  }
}

export default Produto;