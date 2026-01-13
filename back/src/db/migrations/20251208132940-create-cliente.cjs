'use strict'; /** 
@type {import('sequelize-cli').Migration} */ 
module.exports = { 
  async up (queryInterface, Sequelize) { 
    await queryInterface.createTable('clientes', { 
      id: { 
        allowNull: false, 
        autoIncrement: true, 
        primaryKey: true, 
        type: Sequelize.INTEGER 
      }, 
      nome: { 
        type: Sequelize.STRING, 
        allowNull: false 
      }, 
      email: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        unique: true 
      }, 
      saldo: { 
        type: Sequelize.DECIMAL(10, 2), 
        allowNull: false, 
        defaultValue: 0.00 
      }, 
      created_at: { 
        allowNull: false, 
        type: Sequelize.DATE 
      }, 
      updated_at: { 
        allowNull: false, 
        type: Sequelize.DATE 
      } 
    }); 
  }, 

  async down (queryInterface, Sequelize) { 
    await queryInterface.dropTable('clientes'); 
  } 
};