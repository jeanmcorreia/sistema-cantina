import { Model, DataTypes } from 'sequelize';


class Cliente extends Model {
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
        saldo: {
          type: DataTypes.FLOAT,
          defaultValue: 0.0,
        },
      },
      {
        sequelize,
        modelName: 'Cliente',
        
      }
    );
  }
  
  static associate(models) {
    this.hasMany(models.Pedido, { foreignKey: 'cliente_id' });
  }
}

export default Cliente;
