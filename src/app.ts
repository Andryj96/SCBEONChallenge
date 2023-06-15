import express, { Request, Response } from 'express';
import catalogRouter from './routes/v1';
import swaggerDocument from './constants/swagger.json';

const app = express();

app.use(express.json());

app.use('/api', catalogRouter);

app.get('/api', (_req: Request, res: Response) => {
  // #swagger.description = 'Get Api status message.'
  /* #swagger.responses[200] = {
        description: 'Return a message',
        schema: { 
          dateil: 'Catalog Api Ok'
        }
  } 
  */
  res.json({ detail: 'Catalog Api Ok' });
});

app.use('/api/swagger', express.static('public/swagger.html'));

app.get(
  ['/api/openapi.json', '/api/swagger/openapi.json'],
  async (_req: Request, res: Response) => {
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.send(swaggerDocument);
  },
);

app.use((_req: Request, res: Response) => {
  //   404 error
  res.status(404).json({ detail: 'Page not found' });
});

app.use((err: Error, _req: Request, res: Response) => {
  res.status(500).json({ detail: err.message || 'System Error' });
});

export default app;
