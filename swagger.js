const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Catalog Api Challenge',
    description: 'Catalog Api Challenge Swagger Documentation',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  definitions: {
    Movie: {
      id: 'MV00000000001',
      title: 'As Aventuras da Turma X',
      description: {
        default: 'Lorem ipsum dolor sitquuntur  laborum.',
        short: 'Lorem ipsum dolor sit amet  elit.',
      },
      runTime: 'PT01H12M',
      subType: 'Feature Film',
      releaseYear: 2001,
      genres: ['Infantil', 'Aventura', 'Animação'],
    },
    Series: {
      id: 'SH00000000001',
      title: 'Jogo das cadeiras',
      description: {
        default: 'Lorem ipsum dolor  voluptatum laborum.',
        short: 'Ldipisicing elit.',
      },
      runTime: 'PT00H30M',
      genres: ['Ação', 'Aventura'],
      releaseYear: 2015,
    },
    Catalog: {
      movies: [{ $ref: '#/definitions/Movie' }],
      series: [{ $ref: '#/definitions/Series' }],
    },
    AddFavorite: {
      $userId: 123,
      $contentId: 'MV00000000001',
      $dateTime: '2023-06-12T22:14:22.000Z',
    },
    ReturnFavorite: {
      userId: 123,
      contentId: 'MV00000000001',
      dateTime: '2023-06-12T22:14:22.000Z',
      id: 1,
    },
    TopFavorite: {
      count: 4,
      content: { $ref: '#/definitions/Movie' },
    },
  },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./src/app.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
