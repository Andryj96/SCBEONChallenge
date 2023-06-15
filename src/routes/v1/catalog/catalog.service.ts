import { Favorite, LAST_ACTION } from '@prisma/client';
import { data } from '../../../constants/catalog.json';
import { Catalog, Movie, Serie, TopContent } from '../../../interfaces';
import prismaService from '../../../prisma/client';

export const getCatalog = (): Catalog => data.catalog as Catalog;
export const getMovies = (): Movie[] => data.catalog.movies as Movie[];
export const getSeries = (): Serie[] => data.catalog.series as Serie[];

export const findContentById = (
  contentId: string,
): Movie | Serie | undefined => {
  // we could check the contentId start 2 chars to check if is MV (Movie) or
  // SH (Serie) but I will check all data

  let content: Movie | Serie | undefined;
  content = getMovies().find((mov) => mov.id === contentId);
  if (!content) content = getSeries().find((serie) => serie.id === contentId);

  return content;
};

/**
 * Get favorite content by user
 * @param userId
 * @returns a catalog object with the favorited content of the user
 */
export const getFaavoritesByUser = async (userId: number): Promise<Catalog> => {
  const favorites = await prismaService.favorite.findMany({
    select: { contentId: true },
    where: { userId },
  });
  const favoritesId = favorites.map((fav) => fav.contentId);
  return getFavoriteDetails(favoritesId);
};

/**
 * Add favorite content
 * @param userId
 * @param contentId
 * @returns the result object referencing content and user
 */
export const addFavorite = async (
  userId: number,
  contentId: string,
): Promise<Favorite> => {
  try {
    const newFavorite = await prismaService.favorite.create({
      data: {
        userId,
        contentId,
      },
    });
    await updateLastAction(userId, LAST_ACTION.ADD);

    return newFavorite;
  } catch (error) {
    throw new Error('Error adding a new favorite content');
  }
};

/**
 * Remove favorite content
 * @param userId
 * @param contentId
 */
export const removeFavorite = async (
  userId: number,
  contentId: string,
): Promise<void> => {
  try {
    await prismaService.favorite.deleteMany({
      where: {
        userId,
        contentId,
      },
    });
    await updateLastAction(userId, LAST_ACTION.REMOVE);
  } catch (error) {
    throw new Error('Error removing a favorite content');
  }
};

/**
 *
 * @param userId
 * @returns last change date time
 */
export const getLastChangeDate = async (
  userId: number,
): Promise<Date | undefined | null> => {
  const lastAction = await prismaService.userLastAction.findUnique({
    where: {
      userId,
    },
  });

  return lastAction?.lastChangeAt;
};

/**
 *
 * @param userId
 * @param contentId
 * @returns true if the content is favorited by this user id
 */
export const isFavorite = async (
  userId: number,
  contentId: string,
): Promise<boolean> => {
  const isFav = await prismaService.favorite.findFirst({
    where: { userId, contentId },
  });
  return !!isFav;
};

export const getTopFavorites = async (): Promise<TopContent[]> => {
  try {
    const mostFavorites = await prismaService.favorite.groupBy({
      by: ['contentId'],
      _count: { contentId: true },
      orderBy: {
        _count: {
          contentId: 'desc',
        },
      },
    });
    return mostFavorites.map((fav) => {
      return {
        count: fav._count.contentId,
        content: findContentById(fav.contentId),
      };
    });
  } catch (error) {
    throw new Error('Error fetching most favorite content.');
  }
};

/**
 *
 * @param contentIds
 * @returns an object with the content data of the given ids
 */
function getFavoriteDetails(contentIds: string[]): Catalog {
  return {
    movies: getMovies().filter((mov) => contentIds.includes(mov.id)),
    series: getSeries().filter((serie) => contentIds.includes(serie.id)),
  };
}

/**
 * Update last action model
 * @param userId
 * @param operation
 * @returns true for a favorite change made or false if not
 */
async function updateLastAction(
  userId: number,
  operation: LAST_ACTION,
): Promise<boolean> {
  const userLastAction = await prismaService.userLastAction.findUnique({
    where: { userId },
  });

  const actionData: {
    userId: number;
    lastAction: LAST_ACTION;
    lastChangeAt?: Date;
  } = {
    userId,
    lastAction: operation,
  };

  if (
    userLastAction?.lastAction === LAST_ACTION.REMOVE &&
    operation === LAST_ACTION.ADD
  )
    actionData.lastChangeAt = new Date();

  await prismaService.userLastAction.upsert({
    where: { userId },
    create: actionData,
    update: actionData,
  });

  return !!actionData.lastChangeAt;
}
