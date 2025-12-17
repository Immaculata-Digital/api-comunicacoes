"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campanhaDisparoRoutes = void 0;
const express_1 = require("express");
const CampanhaDisparoController_1 = require("../controllers/CampanhaDisparoController");
const DisparoAutomaticoController_1 = require("../controllers/DisparoAutomaticoController");
const tenantSchema_1 = require("../../../core/middlewares/tenantSchema");
exports.campanhaDisparoRoutes = (0, express_1.Router)();
exports.campanhaDisparoRoutes.get('/:schema/campanhas-disparo', tenantSchema_1.tenantSchema, CampanhaDisparoController_1.campanhaDisparoController.index);
exports.campanhaDisparoRoutes.get('/:schema/campanhas-disparo/:id', tenantSchema_1.tenantSchema, CampanhaDisparoController_1.campanhaDisparoController.show);
exports.campanhaDisparoRoutes.post('/:schema/campanhas-disparo', tenantSchema_1.tenantSchema, CampanhaDisparoController_1.campanhaDisparoController.store);
exports.campanhaDisparoRoutes.put('/:schema/campanhas-disparo/:id', tenantSchema_1.tenantSchema, CampanhaDisparoController_1.campanhaDisparoController.update);
exports.campanhaDisparoRoutes.delete('/:schema/campanhas-disparo/:id', tenantSchema_1.tenantSchema, CampanhaDisparoController_1.campanhaDisparoController.destroy);
exports.campanhaDisparoRoutes.post('/:schema/campanhas-disparo/:id/enviar', tenantSchema_1.tenantSchema, CampanhaDisparoController_1.campanhaDisparoController.enviar);
exports.campanhaDisparoRoutes.post('/:schema/disparo-automatico', tenantSchema_1.tenantSchema, DisparoAutomaticoController_1.disparoAutomaticoController.disparar);
//# sourceMappingURL=campanhaDisparo.routes.js.map