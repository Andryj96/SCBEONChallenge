import { Request, Response, NextFunction } from 'express';
import { findContentById, getFaavoritesByUser } from './catalog.service';

export const validateAddFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId, contentId } = req.body;
  // Asume userId is an Id number

  // Validate  userId and contentId
  if (!Number.isInteger(userId) || !contentId) {
    return res.status(400).json({
      detail: 'You must provide userId (number) and contentId (string)',
    });
  }
  // Validate if contentId exists
  if (!findContentById(contentId))
    return res
      .status(400)
      .json({
        detail: 'Content with this conteId does not exists in the catalog.',
      });

  // check for favorite limit
  const favorites = await getFaavoritesByUser(userId);
  if (favorites.movies.length + favorites.series.length === 3)
    return res.status(400).json({
      detail:
        'You exceeded the limit of favorite content (3 max), you need to delete some of them before.',
    });

  // check if the content is already favorited
  if (
    favorites.movies.find((movie) => movie.id === contentId) ||
    favorites.series.find((serie) => serie.id === contentId)
  )
    return res.status(400).json({
      detail: 'You already has this content as favorite.',
    });

  // check for not allowed change in last 5 days
  next();
};
