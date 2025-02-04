import { NextFunction, Request, Response } from 'express';
import { logger } from '../index';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error({ err, req: { method: req.method, url: req.url } });
    res.status(500).json({ error: 'Internal server error' });
};