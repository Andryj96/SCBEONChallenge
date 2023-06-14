import * as catalogService from './catalog.service';

describe('Catalog service', () => {
  describe('Catalog static data', () => {
    it('should get entire catalog', () => {
      const content = catalogService.getCatalog();
      expect(content.movies).toBeDefined();
      expect(content.series).toBeDefined();
    });

    it('should get catalog by id', () => {
      const content = catalogService.findContentById('MV00000000002');
      expect(content).toBeDefined();
      expect(content?.id).toBe('MV00000000002');
    });

    it('should return undefined in get invalid catalog by id', () => {
      const content = catalogService.findContentById('MV00000100002');
      expect(content).toBeUndefined();
    });

    it('should get movies', () => {
      const movies = catalogService.getMovies();
      expect(movies.length).toBeGreaterThan(0);
    });

    it('should get series', () => {
      const series = catalogService.getSeries();
      expect(series.length).toBeGreaterThan(0);
    });
  });

  describe('Catalog interaction with db', () => {
    it('Should add a fovorite', async () => {
      const favorite = await catalogService.addFavorite(1234, 'SH00000000003');
      expect(favorite.id).toBeDefined();
    });
    it('Should return lastAction', async () => {
      const lastActionDate = await catalogService.getLastActionDate(1234);
      expect(typeof lastActionDate).toBe('string');
    });
  });
});