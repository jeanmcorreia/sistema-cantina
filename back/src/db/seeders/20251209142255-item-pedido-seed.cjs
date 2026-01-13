'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('item_pedidos', [
      {
        pedido_id: 1,
        produto_id: 1,  // Coxinha
        quantidade: 2,
        preco_unitario: 5.50,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        pedido_id: 1,
        produto_id: 2,  // Suco Natural
        quantidade: 1,
        preco_unitario: 4.00,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Pedido 2 (cliente 2)
      {
        pedido_id: 2,
        produto_id: 3,  // Pastel
        quantidade: 1,
        preco_unitario: 6.00,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Pedido 3 (cliente 3)
      {
        pedido_id: 3,
        produto_id: 1,
        quantidade: 1,
        preco_unitario: 5.50,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        pedido_id: 3,
        produto_id: 5, // Refrigerante
        quantidade: 1,
        preco_unitario: 5.00,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Pedido 4 (cliente 1)
      {
        pedido_id: 4,
        produto_id: 4,  // Bolo
        quantidade: 2,
        preco_unitario: 3.50,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Pedido 5 (cliente 2)
      {
        pedido_id: 5,
        produto_id: 2,  // Suco
        quantidade: 1,
        preco_unitario: 4.00,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('item_pedidos', null, {});
  }
};
