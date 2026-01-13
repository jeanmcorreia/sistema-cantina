'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('clientes', [
      {
        nome: 'Jean Marcos',
        email: 'jean@example.com',
        saldo: 100.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'David Gabriel',
        email: 'david@example.com',
        saldo: 50.00,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'Pedro Lima',
        email: 'pedro@example.com',
        saldo: 75.00,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('clientes', null, {});
  }
};
