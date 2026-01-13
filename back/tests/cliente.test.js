import request from "supertest";
import app from '../src/app.js';
import Cliente from '../src/app/models/Cliente.js';

describe("ClienteController", () => {
    beforeAll(async () => {
        await Cliente.sync({ force: true });
    });

    it('Deve criar um cliente válido', async () => {
        const response = await request(app)
            .post('/clientes')
            .send({
                nome: 'João Teste',
                email: 'joao@teste.com',
                senha: '123456',
                senhaConfirmation: '123456',
                saldo: 50,
            });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe('joao@teste.com');
    });

    it('Não deve criar cliente com email duplicado', async () => {
        await Cliente.create({
            nome: 'Maria',
            email: 'maria@teste.com',
            senha: '123456',
            saldo: 0,
        });

        const response = await request(app)
            .post('/clientes')
            .send({
                nome: 'Maria',
                email: 'maria@teste.com',
                senha: '123456',
                senhaConfirmation: '123456',
            });
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('E-mail já cadastrado.');
    });
        
    it('Não deve criar cliente com senha curta', async() => {
        const response = await request(app)
            .post('/clientes')
            .send({
                nome: 'Teste',
                email: 'teste@teste.com',
                senha: '123',
                senhaConfirmation: '123',
            });
            
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});
