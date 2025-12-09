"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const remetenteSmtp_routes_1 = require("../modules/remetentes-smtp/routes/remetenteSmtp.routes");
const campanhaDisparo_routes_1 = require("../modules/campanhas-disparo/routes/campanhaDisparo.routes");
const router = (0, express_1.Router)();
exports.routes = router;
router.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API Comunicações está funcionando' });
});
router.use(remetenteSmtp_routes_1.remetenteSmtpRoutes);
router.use(campanhaDisparo_routes_1.campanhaDisparoRoutes);
//# sourceMappingURL=index.js.map