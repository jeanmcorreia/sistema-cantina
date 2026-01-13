import { Model, DataTypes } from 'sequelize';

class ItemPedido extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        quantidade: DataTypes.INTEGER,
        preco_unitario: DataTypes.DECIMAL(10, 2),
      },
      {
        sequelize,
        tableName: 'item_pedidos',
        underscored: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Pedido, { foreignKey: 'pedido_id', as: 'pedido' });
    this.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produto' });
  }
}

export default ItemPedido;
