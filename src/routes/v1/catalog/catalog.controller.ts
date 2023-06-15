import express from 'express';
import * as catalogService from './catalog.service';
import {
  validateAddFavorite,
  validateRemoveFavorite,
  validateUserIdParam,
} from './catalog.middleware';

const router = express.Router();

router.get('/', (_req, res) => {
  const catalog = catalogService.getCatalog();
  res.json(catalog);
});

router.get('/movies', (_req, res) => {
  const movies = catalogService.getMovies();
  res.json(movies);
});

router.get('/series', (_req, res) => {
  const series = catalogService.getSeries();
  res.json(series);
});

router.get('/favorites/user/:userId', validateUserIdParam, async (req, res) => {
  const { userId } = req.params;
  const favorites = await catalogService.getFaavoritesByUser(+userId);
  res.json(favorites);
});

router.post('/favorites/user/', validateAddFavorite, async (req, res) => {
  const { userId, contentId, dateTime } = req.body;

  const newFavorite = await catalogService.addFavorite(userId, contentId);
  res.json({ userId, contentId, dateTime, id: newFavorite.id });
});

router.delete(
  '/favorites/user/:userId/:contentId',
  validateRemoveFavorite,
  async (req, res) => {
    const { userId, contentId } = req.params;
    await catalogService.removeFavorite(+userId, contentId);
    res.json({ detail: 'Favorite content removed.' });
  },
);

router.get('/favorites/top', async (_req, res) => {
  res.json(await catalogService.getTopFavorites());
});

export default router;
