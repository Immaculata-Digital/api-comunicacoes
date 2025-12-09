"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const app_1 = require("./app");
const { port } = env_1.env.app;
app_1.app.listen(port, () => {
    console.log(`🚀 API Comunicações iniciada em http://localhost:${port}/api`);
    console.log(`📚 Documentação Swagger: http://localhost:${port}/docs`);
});
//# sourceMappingURL=server.js.map