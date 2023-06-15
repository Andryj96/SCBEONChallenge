import { Router } from 'express';

import catalogV1 from './catalog/catalog.controller';

const router = Router();

router.use('/v1/catalog/', catalogV1);

export default router;
