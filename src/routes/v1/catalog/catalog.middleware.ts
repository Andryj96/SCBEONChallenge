import { Request, Response, NextFunction } from 'express';
import { findContentById, getFaavoritesByUser } from './catalog.service';

export const validateAddFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId, contentId, dateTime } = req.body;
  // Asume userId is an Id number

  // Validate  userId and contentId
  if (!Number.isInteger(userId) || !contentId || !dateTime) {
    return res.status(400).json({
      detail:
        'You must provide userId (number), contentId (string) and dateTime (YYYY-MM-DDTHH:mm:ss.sssZ)',
    });
  }

  //Check datetime format ISO 8601:2000
  // I am passing the datetime when creating a favorite because
  // it says so in the requirements but I don't see the point,
  // I will save the current date and time when adding a
  // favorite to have the most precise control of the favorite changes

  const iso8601Regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)$/;
  if (!iso8601Regex.test(dateTime))
    return res.status(400).json({
      detail: 'You must provide dateTime in format YYYY-MM-DDTHH:mm:ss.sssZ',
    });
  // Validate if contentId exists
  if (!findContentById(contentId))
    return res.status(400).json({
      detail: 'Content with this conteId does not exist in the catalog.',
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
