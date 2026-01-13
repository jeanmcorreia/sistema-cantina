'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('produtos', [
      {
        nome: 'Coxinha',
        preco: 5.50,
        ativo: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'Suco Natural',
        preco: 4.00,
        ativo: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'Pastel de Queijo',
        preco: 6.00,
        ativo: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'Bolo de Chocolate (fatia)',
        preco: 3.50,
        ativo: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'Refrigerante Lata',
        preco: 5.00,
        ativo: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('produtos', null, {});
  }
};
