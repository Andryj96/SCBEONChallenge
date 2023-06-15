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
      const res = await request(app).get('/api/v1/catalog/series');
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
      expect(res.status).toBe(201);
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
      expect(res.status).toBe(201);
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
      expect(res.body.detail).toContain('you can make a change of content.');
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

    it('Should return all favorites by user populated', async () => {
      const res = await request(app).get('/api/v1/catalog/favorites/user/1234');
      expect(res.status).toBe(200);
      expect(res.body.movies.length + res.body.series.length).toBe(3);
    });

    it('Should remove a favorite', async () => {
      const res = await request(app).delete(
        '/api/v1/catalog/favorites/user/1234/SH00000000001',
      );
      expect(res.status).toBe(204);
    });

    it('Should not remove a favorite that does not exist', async () => {
      const res = await request(app).delete(
        '/api/v1/catalog/favorites/user/1234/SH00000000001',
      );
      expect(res.status).toBe(400);
      expect(res.body.detail).toContain('This content has not favorited yet.');
    });

    it('Should create another favorite', async () => {
      const res = await request(app)
        .post('/api/v1/catalog/favorites/user/')
        .send({
          userId: 1234,
          contentId: 'MV00000000003',
          dateTime: '2022-06-14T10:00:00.000Z',
        });
      expect(res.status).toBe(201);
    });

    it('Should return bad request when try to add a \
    favorite with already has 3 and before 5 \
     days after last change', async () => {
      const res = await request(app)
        .post('/api/v1/catalog/favorites/user/')
        .send({
          userId: 1234,
          contentId: 'MV00000000001',
          dateTime: '2022-06-14T10:00:00.000Z',
        });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('canChangeAfter');
      expect(res.body.detail).toContain('can not make a change');
    });

    it('Should return bad request when try delete favorite that was deleted', async () => {
      const res = await request(app).delete(
        '/api/v1/catalog/favorites/user/1234/SH00000000001',
      );
      expect(res.status).toBe(400);
      expect(res.body.detail).toContain('This content has not favorited yet.');
    });

    it('Should return bad request when try to delete the last \
    favorite before 5 days after last change  ', async () => {
      await prismaService.favorite.deleteMany({
        where: { contentId: { in: ['MV00000000002', 'MV00000000003'] } },
      });

      const res = await request(app).delete(
        '/api/v1/catalog/favorites/user/1234/MV00000000004',
      );
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('canChangeAfter');
      expect(res.body.detail).toContain('only have one favorite content');
    });

    it('Should return bad request when try to add a \
    favorite with before 5 days after last change', async () => {
      const res = await request(app)
        .post('/api/v1/catalog/favorites/user/')
        .send({
          userId: 1234,
          contentId: 'MV00000000001',
          dateTime: '2022-06-14T10:00:00.000Z',
        });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('canChangeAfter');
      expect(res.body.detail).toContain('5 days after your last change');
    });

    it('Should return top favorite list', async () => {
      const res = await request(app).get('/api/v1/catalog/favorites/top');
      expect(res.status).toBe(200);
      expect(res.body[0].count).toBeDefined();
    });
  });
});
