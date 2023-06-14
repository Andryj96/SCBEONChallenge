import request from 'supertest';
import app from '../src/app';
import prismaService from '../src/prisma/client';

describe('Catalog Api test', () => {
  beforeAll(async () => {
    await prismaService.$transaction([
      prismaService.favorite.deleteMany(),
      prismaService.userLastAction.deleteMany(),
    ]);
  });

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
    it('Should return all favorites by user', async () => {
      const res = await request(app).get('/api/v1/catalog/favorites/user/1234');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ movies: [], series: [] });
    });

    it('Should add a favorite content movie', async () => {
      const res = await request(app)
        .post('/api/v1/catalog/favorites/user/')
        .send({
          userId: 1234,
          contentId: 'MV00000000002',
          dateTime: '2022-06-14T10:00:00.000Z',
        });
      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
    });

    it('Should add a favorite content series', async () => {
      const res = await request(app)
        .post('/api/v1/catalog/favorites/user/')
        .send({
          userId: 1234,
          contentId: 'SH00000000001',
          dateTime: '2022-06-14T10:00:00.000Z',
        });
      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
    });

    it('Should return bad request content not found', async () => {
      const res = await request(app)
        .post('/api/v1/catalog/favorites/user/')
        .send({
          userId: 1234,
          contentId: 'xxxx',
          dateTime: '2022-06-14T10:00:00.000Z',
        });
      expect(res.status).toBe(400);
    });

    it('Should return bad request invalid userId', async () => {
      const res = await request(app)
        .post('/api/v1/catalog/favorites/user/')
        .send({
          userId: '1234',
          contentId: 'SH00000000001',
          dateTime: '2022-06-14T10:00:00.000Z',
        });
      expect(res.status).toBe(400);
      expect(res.body.detail).toContain('You must provide userId');
    });

    it('Should return bad request limit exceeded', async () => {
      await prismaService.favorite.create({
        data: { userId: 1234, contentId: 'MV00000000004' },
      });
      const res = await request(app)
        .post('/api/v1/catalog/favorites/user/')
        .send({
          userId: 1234,
          contentId: 'SH00000000001',
          dateTime: '2022-06-14T10:00:00.000Z',
        });
      expect(res.status).toBe(400);
      expect(res.body.detail).toContain('You exceeded the limit');
    });

    it('Should return bad request content does not exist', async () => {
      const res = await request(app)
        .post('/api/v1/catalog/favorites/user/')
        .send({
          userId: 1234,
          contentId: 'SH00000000005',
          dateTime: '2022-06-14T10:00:00.000Z',
        });
      expect(res.status).toBe(400);
      expect(res.body.detail).toContain('conteId does not exist');
    });

    it('Should return last action date', async () => {
      const res = await request(app)
        .post('/api/v1/catalog/favorites/user/')
        .send({
          userId: 1234,
          contentId: 'SH00000000005',
          dateTime: '2022-06-14T10:00:00.000Z',
        });
      expect(res.status).toBe(400);
      expect(res.body.detail).toContain('conteId does not exist');
    });
  });
});
