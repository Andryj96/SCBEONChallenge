import request from 'supertest';
import app from '../src/app';

describe('Catalog Api test', () => {
  beforeAll(() => {});

  afterAll(() => {});

  describe('Main app', () => {
    it('Should return ok', async () => {
      const res = await request(app).get('/api/');
      expect(res.status).toBe(200);
    });
    it('Should return not found', async () => {
      const res = await request(app).get('/api/v2');
      expect(res.status).toBe(404);
    });
  });

  describe('Get catalog', () => {
    it('Should return all catalog data', async () => {
      const res = await request(app).get('/api/v1/catalog/');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('movies');
      expect(res.body).toHaveProperty('series');
    });
    it('Should return movies', async () => {
      const res = await request(app).get('/api/v1/catalog/movies');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
    it('Should return series', async () => {
      const res = await request(app).get('/api/v1/catalog/movies');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('Favorites test', () => {
    it.todo('Should return all favorites by user');
    it.todo('Should add a favorite content');
    it.todo('Should return bad request limit exceeded');
    it.todo('Should return bad request invalid userId');
    it.todo('Should return bad request content not found');
  });
});
