import catalog from '../../../constants/catalog.json';
import { Movie, Serie } from '../../../interfaces';

const movies: Movie[] = catalog.data.catalog.movies as Movie[];
const series: Serie[] = catalog.data.catalog.series as Serie[];

export const getMovies = (): Movie[] => movies;
export const getSeries = (): Serie[] => series;
