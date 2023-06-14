import { Favorite } from '@prisma/client';
import { data } from '../../../constants/catalog.json';
import { Catalog, Movie, Serie } from '../../../interfaces';
import prismaService from '../../../prisma/client';

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

export const getFaavorites = async (userId: number): Promise<Catalog> => {
  const favorites = await prismaService.favorite.findMany({
    select: { contentId: true },
    where: { userId },
  });
  const favoritesId = favorites.map((fav) => fav.contentId);
  return getFavoriteDetails(favoritesId);
};

export const addFavorite = async (
  userId: number,
  contentId: string,
  // datetime: string,
): Promise<Favorite> => {
  const newFavorite = await prismaService.favorite.create({
    data: {
      userId,
      contentId,
    },
  });

  return newFavorite;
};
function getFavoriteDetails(contentIds: string[]): Catalog {
  return {
    movies: getMovies().filter((mov) => contentIds.includes(mov.id)),
    series: getSeries().filter((serie) => contentIds.includes(serie.id)),
  };
}
