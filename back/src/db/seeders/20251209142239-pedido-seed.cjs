'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pedidos', [
      {
        cliente_id: 1,
        total: 15.50,
        status: 'aberto',
        data_pedido: new Date('2025-12-01T10:30:00'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        cliente_id: 2,
        total: 8.00,
        status: 'pago',
        data_pedido: new Date('2025-12-01T11:10:00'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        cliente_id: 3,
        total: 12.25,
        status: 'cancelado',
        data_pedido: new Date('2025-12-02T09:45:00'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        cliente_id: 1,
        total: 22.00,
        status: 'aberto',
        data_pedido: new Date('2025-12-03T14:00:00'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        cliente_id: 2,
        total: 5.50,
        status: 'pago',
        data_pedido: new Date('2025-12-04T08:20:00'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pedidos', null, {});
  }
};
