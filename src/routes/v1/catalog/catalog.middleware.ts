import { Request, Response, NextFunction } from 'express';
import {
  findContentById,
  getFaavoritesByUser,
  getLastChangeDate,
  isFavorite,
} from './catalog.service';
import { isFiveDaysAfter, iso8601Regex } from '../../../utils/utils';
import moment from 'moment';

export const validateUserIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  if (Number.isNaN(+userId))
    return res
      .status(400)
      .json({ detail: 'You must specify the userId as number' });

  next();
};

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
      canChangeAfter: null,
    });
  }

  //Check datetime format ISO 8601:2000
  // I am passing the datetime when creating a favorite because
  // it says so in the requirements but I don't see the point,
  // I will save the current date and time when adding a
  // favorite to have the most precise control of the favorite changes

  if (!iso8601Regex.test(dateTime))
    return res.status(400).json({
      detail: 'You must provide dateTime in format YYYY-MM-DDTHH:mm:ss.sssZ',
      canChangeAfter: null,
    });

  // Validate if contentId exists
  if (!findContentById(contentId))
    return res.status(400).json({
      detail: 'Content with this conteId does not exist in the catalog.',
      canChangeAfter: null,
    });

  // check for favorite limit
  const favorites = await getFaavoritesByUser(userId);
  const lastChangeAt = await getLastChangeDate(userId);

  if (favorites.movies.length + favorites.series.length === 3)
    if (!lastChangeAt || isFiveDaysAfter(lastChangeAt))
      return res.status(400).json({
        detail:
          'You exceeded the limit of favorite content (3 max), you can make a change of content.',
        canChangeAfter: null,
      });
    else {
      const canChangeAfter = moment(lastChangeAt).add(5, 'days');
      return res.status(400).json({
        detail: `You exceeded the limit of favorite content (3 max), 
        you can not make a change of content after ${canChangeAfter.toISOString()} 
        only delete and wait some days`,
        canChangeAfter: canChangeAfter.toISOString(),
      });
    }

  // check if the content is already favorited
  if (
    favorites.movies.find((movie) => movie.id === contentId) ||
    favorites.series.find((serie) => serie.id === contentId)
  )
    return res.status(400).json({
      detail: 'You already has this content as favorite.',
      canChangeAfter: null,
    });

  // check for not allowed change in last 5 days
  if (lastChangeAt && !isFiveDaysAfter(lastChangeAt)) {
    const canChangeAfter = moment(lastChangeAt).add(5, 'days');
    return res.status(400).json({
      detail: `You can change the favorite 5 days after your last change, you can make a change after ${canChangeAfter.toISOString()}.`,
      canChangeAfter: canChangeAfter.toISOString(),
    });
  }

  next();
};

export const validateRemoveFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId, contentId } = req.params;
  // Asume userId is an Id number

  // Validate  userId and contentId
  if (Number.isNaN(+userId) || !contentId) {
    return res.status(400).json({
      detail: 'You must provide userId (number), contentId (string) in params',
      canChangeAfter: null,
    });
  }

  // Validate if contentId exists
  if (!findContentById(contentId))
    return res.status(400).json({
      detail: 'Content with this conteId does not exist in the catalog.',
      canChangeAfter: null,
    });

  // check for not favorited
  const isFav = await isFavorite(+userId, contentId);
  if (!isFav)
    return res.status(400).json({
      detail: 'This content has not favorited yet.',
      canChangeAfter: null,
    });

  // check for not allowed change in last 5 days and last favorite
  const lastChangeAt = await getLastChangeDate(+userId);
  const favorites = await getFaavoritesByUser(+userId);
  const favCount = favorites.movies.length + favorites.series.length;

  const canChangeAfter = moment(lastChangeAt).add(5, 'days');

  if (lastChangeAt && !isFiveDaysAfter(lastChangeAt) && favCount == 1)
    return res.status(400).json({
      detail: `You can not remove this content until ${canChangeAfter.toISOString()}. 
      You must wait 5 days after last change because you 
      only have one favorite content.`,
      canChangeAfter: canChangeAfter.toISOString(),
    });

  next();
};
