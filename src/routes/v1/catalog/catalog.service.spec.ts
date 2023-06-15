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
});
