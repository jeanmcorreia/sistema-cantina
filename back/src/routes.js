import { Router } from "express";
import SessaoController from "./app/controllers/SessaoController.js";
import ClienteController from "./app/controllers/ClienteController.js"
import PedidoController from "./app/controllers/PedidoController.js";
import ProdutoController from "./app/controllers/ProdutoController.js";
import UsuarioController from "./app/controllers/UsuarioController.js";


const routes = new Router();

routes.post("/sessions", SessaoController.create);
routes.post("/usuarios", UsuarioController.register);


routes.post("/clientes", ClienteController.register)
routes.get("/clientes", ClienteController.index)
routes.put("/clientes/:id", ClienteController.update)
routes.delete("/clientes/:id", ClienteController.delete)

routes.post("/pedidos", PedidoController.create);
routes.get("/pedidos", PedidoController.listar);
routes.put("/pedidos/:id/pagar", PedidoController.pagar);
routes.put("/pedidos/:id/cancelar", PedidoController.cancelar);

routes.post("/produtos", ProdutoController.store);
routes.get("/produtos", ProdutoController.index);
routes.get("/produtos/:id", ProdutoController.show);
routes.put("/produtos/:id", ProdutoController.update);
routes.patch("/produtos/:id/ativo", ProdutoController.toggleAtivo);
routes.delete("/produtos/:id", ProdutoController.delete);

routes.get("/pedidos", PedidoController.listar)
routes.post("/pedidos", PedidoController.create)
routes.put("/pedidos/:id/pagar", PedidoController.pagar)
routes.put("/pedidos/:id/cancelar", PedidoController.cancelar)



export default routes;