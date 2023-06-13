import express, { Request, Response } from 'express';

const app = express();

app.use(express.json());

app.get('/api/', (_req: Request, res: Response) => {
  res.json({ detail: 'Catalog Api Ok' });
});

app.use((_req: Request, res: Response) => {
  //   404 error
  res.status(404).json({ detail: 'Page not found' });
});

app.use((err: Error, _req: Request, res: Response) => {
  res.status(500).json({ detail: err.message || 'System Error' });
});

export default app;
