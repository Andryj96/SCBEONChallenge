import express from 'express';
import * as moviesService from './catalog.service';

const router = express.Router();

router.get('/movies', (_req, res) => {
  const movies = moviesService.getMovies();
  res.json(movies);
});

router.get('/series', (_req, res) => {
  const series = moviesService.getSeries();
  res.json(series);
});

export default router;
