import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Payload Transformer API',
      version: '1.0.0',
      description: 'API for transforming JSON payloads',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5005}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/index.ts'],
};

export const specs = swaggerJsdoc(options);