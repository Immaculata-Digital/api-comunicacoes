import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
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
}

export const swaggerSpec = swaggerJsdoc(options)

