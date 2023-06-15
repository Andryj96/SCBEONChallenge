import express, { Request, Response } from 'express';
import * as catalogService from './catalog.service';
import {
  validateAddFavorite,
  validateRemoveFavorite,
  validateUserIdParam,
} from './catalog.middleware';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  // #swagger.description = 'Get the entire catalog.'
  /* #swagger.responses[200] = {
        description: 'Return the entire catalog',
        schema: { $ref: "#/definitions/Catalog" }
  } 
  */
  const catalog = catalogService.getCatalog();
  res.json(catalog);
});

router.get('/movies', (_req: Request, res: Response) => {
  // #swagger.description = 'Get all existing movies.'
  /* #swagger.responses[200] = {
        description: 'Return list of movies',
        schema: [{ $ref: "#/definitions/Movie" }]
  } 
  */
  const movies = catalogService.getMovies();
  res.json(movies);
});

router.get('/series', (_req: Request, res: Response) => {
  // #swagger.description = 'Get all existing series.'
  /* #swagger.responses[200] = {
        description: 'Return list of series',
        schema: [{ $ref: "#/definitions/Series" }]
  } 
  */
  const series = catalogService.getSeries();
  res.json(series);
});

router.get(
  '/favorites/user/:userId',
  validateUserIdParam,
  async (req: Request, res: Response) => {
    // #swagger.description = 'Get favorited content from one user.'
    /* #swagger.responses[200] = {
        description: 'Return a catalog of favorites',
        schema: { $ref: "#/definitions/Catalog" }
  }*/

    /*  #swagger.responses[400] = {
          description: 'Invalid param data',
          schema: { detail: 'Error message' }
    } 
  */

    const { userId } = req.params;
    const favorites = await catalogService.getFaavoritesByUser(+userId);
    res.json(favorites);
  },
);

router.post(
  '/favorites/user/',
  validateAddFavorite,
  async (req: Request, res: Response) => {
    // #swagger.description = 'Add favorite content to an user.'
    /*    #swagger.parameters['obj'] = {
          in: 'body',
          description: 'Adding new favorite.',
          schema: { $ref: '#/definitions/AddFavorite' }
  } */
    /* #swagger.responses[201] = {
        description: 'Return a catalog of favorites',
        schema: { $ref: "#/definitions/ReturnFavorite" }
    } 
  */
    /* #swagger.responses[400] = {
        description: 'Invalid data or validation errors',
        schema: { 
          detail: 'Error message',
          canChangeAfter: '2023-06-22T22:12:12.000Z | null' 
        }
    } 
  */
    const { userId, contentId, dateTime } = req.body;

    const newFavorite = await catalogService.addFavorite(userId, contentId);
    res.status(201).json({ userId, contentId, dateTime, id: newFavorite.id });
  },
);

router.delete(
  '/favorites/user/:userId/:contentId',
  validateRemoveFavorite,
  async (req: Request, res: Response) => {
    // #swagger.description = 'Remove favorite content from user.'

    /* #swagger.responses[204] = {
        description: 'No content',
    } 
  */
    /* #swagger.responses[400] = {
        description: 'Invalid data or validation errors',
        schema: { 
          detail: 'Error message',
          canChangeAfter: '2023-06-22T22:12:12.000Z | null' 
        }
    } 
  */
    const { userId, contentId } = req.params;
    await catalogService.removeFavorite(+userId, contentId);
    res.status(204).end();
  },
);

router.get('/favorites/top', async (_req: Request, res: Response) => {
  // #swagger.description = 'Get most favorite content in descending order.'
  /* #swagger.responses[200] = {
        description: 'Return list of top favorited content',
        schema: [{ $ref: "#/definitions/TopFavorite" }]
    } 
  */
  res.json(await catalogService.getTopFavorites());
});

export default router;
