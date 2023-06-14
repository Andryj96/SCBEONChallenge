import { Request, Response, NextFunction } from 'express';
import { findContentById } from './catalog.service';

export const validateAddFavorite = (
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
      .json({ detail: 'Content with conteId does not exists in the catalog.' });

  next();
};
