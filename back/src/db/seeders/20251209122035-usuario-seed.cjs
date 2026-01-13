'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hash1 = await bcrypt.hash('senha123', 8);
    const hash2 = await bcrypt.hash('senha456', 8);
    const hash3 = await bcrypt.hash('senha789', 8);

    await queryInterface.bulkInsert('usuarios', [
      {
        nome: 'Jean Marcos',
        email: 'jean@example.com',
        senha_hash: hash1,
        funcao: 'Analista',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'David Gabriel',
        email: 'david@example.com',
        senha_hash: hash2,
        funcao: 'Desenvolvedor',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nome: 'Pedro Lima',
        email: 'pedro@example.com',
        senha_hash: hash3,
        funcao: 'Estagiário',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};
