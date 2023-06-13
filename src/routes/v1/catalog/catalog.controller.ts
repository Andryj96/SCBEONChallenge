import express from 'express';
import * as catalogService from './catalog.service';

const router = express.Router();

router.get('/movies', (_req, res) => {
  const movies = catalogService.getMovies();
  res.json(movies);
});

router.get('/series', (_req, res) => {
  const series = catalogService.getSeries();
  res.json(series);
});

router.get('/favorites/user/:userId', async (_req, res) => {
  res.json('get favorites');
});

router.post('/favorites/user/', async (_req, res) => {
  res.json('Add a favorite');
});

router.delete('/favorites/user/:userId/:contentId', async (_req, res) => {
  res.json('remove a favorite');
});

router.get('/favorites/top', async (_req, res) => {
  res.json('most favorite content');
});

export default router;
