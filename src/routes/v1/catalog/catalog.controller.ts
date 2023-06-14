import express from 'express';
import * as catalogService from './catalog.service';
import { validateAddFavorite } from './catalog.middleware';

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

router.get('/favorites/user/:userId', async (req, res) => {
  const { userId } = req.params;
  if (Number.isNaN(+userId))
    return res
      .status(400)
      .json({ detail: 'You must specify the user id as number' });

  const favorites = await catalogService.getFaavoritesByUser(+userId);
  res.json(favorites);
});

router.post('/favorites/user/', validateAddFavorite, async (req, res) => {
  const { userId, contentId, dateTime } = req.body;

  const newFavorite = await catalogService.addFavorite(userId, contentId);
  res.json({ userId, contentId, dateTime, id: newFavorite.id });
});

router.delete('/favorites/user/:userId/:contentId', async (_req, res) => {
  res.json('remove a favorite');
});

router.get('/favorites/top', async (_req, res) => {
  res.json('most favorite content');
});

export default router;
