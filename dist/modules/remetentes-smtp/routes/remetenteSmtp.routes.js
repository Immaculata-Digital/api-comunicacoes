"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remetenteSmtpRoutes = void 0;
const express_1 = require("express");
const RemetenteSmtpController_1 = require("../controllers/RemetenteSmtpController");
const tenantSchema_1 = require("../../../core/middlewares/tenantSchema");
exports.remetenteSmtpRoutes = (0, express_1.Router)();
exports.remetenteSmtpRoutes.get('/:schema/remetentes-smtp', tenantSchema_1.tenantSchema, RemetenteSmtpController_1.remetenteSmtpController.index);
exports.remetenteSmtpRoutes.get('/:schema/remetentes-smtp/:id', tenantSchema_1.tenantSchema, RemetenteSmtpController_1.remetenteSmtpController.show);
exports.remetenteSmtpRoutes.post('/:schema/remetentes-smtp', tenantSchema_1.tenantSchema, RemetenteSmtpController_1.remetenteSmtpController.store);
exports.remetenteSmtpRoutes.put('/:schema/remetentes-smtp/:id', tenantSchema_1.tenantSchema, RemetenteSmtpController_1.remetenteSmtpController.update);
exports.remetenteSmtpRoutes.delete('/:schema/remetentes-smtp/:id', tenantSchema_1.tenantSchema, RemetenteSmtpController_1.remetenteSmtpController.destroy);
//# sourceMappingURL=remetenteSmtp.routes.js.map