export type Genre =
  | 'Comédia'
  | 'Ação'
  | 'Aventura'
  | 'Suspense'
  | 'Drama'
  | 'Infantil'
  | 'Animação';

export interface Serie {
  id: string;
  title: string;
  description: {
    default: string;
    short: string;
  };
  runTime: string;
  releaseYear: number;
  genres: Genre[];
}

export interface Movie extends Serie {
  subType: string;
}
