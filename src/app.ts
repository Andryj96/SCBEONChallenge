import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import catalogRouter from './routes/v1';
import swaggerDocument from '../swagger.json';

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

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_req: Request, res: Response) => {
  //   404 error
  res.status(404).json({ detail: 'Page not found' });
});

app.use((err: Error, _req: Request, res: Response) => {
  res.status(500).json({ detail: err.message || 'System Error' });
});

export default app;
