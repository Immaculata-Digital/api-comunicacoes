"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Comunicações',
            version: '1.0.0',
            description: 'API de Comunicações - Gerenciamento de SMTP e Campanhas de Disparo',
            contact: {
                name: 'Immaculata',
            },
        },
        servers: [
            {
                url: 'http://localhost:3336/api',
                description: 'Servidor de desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/**/*.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map