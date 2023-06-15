const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Catalog Api Challenge',
    description: 'Catalog Api Challenge Swagger Documentation',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./src/app.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
