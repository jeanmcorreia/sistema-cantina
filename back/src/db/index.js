import { Sequelize } from 'sequelize';
import config from '../config/database.js';

import Cliente from '../app/models/Cliente.js';
import Pedido from '../app/models/Pedido.js';
import Produto from '../app/models/Produto.js';
import ItemPedido from '../app/models/ItemPedido.js';
import Usuario from '../app/models/Usuario.js';

const models = [Cliente, Pedido, Produto, ItemPedido, Usuario];

class Database {
  constructor() {
    this.connection = new Sequelize(config);

    this.initModels();
    this.associate();
  }

  initModels() {
    models.forEach(model => model.init(this.connection));
  }

  associate() {
    models.forEach(model => {
      if (model.associate) model.associate(this.connection.models);
    });
  }
}

export default new Database();
