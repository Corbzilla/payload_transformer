import { Request, Response, NextFunction } from 'express';
import { logger } from '../index';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: Date.now() - start
        });
    });
    next();
};