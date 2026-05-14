import { NextFunction, Request, Response } from 'express';
import { config } from '../config.js';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from './errors.js';

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
        const statusCode = res.statusCode;
        if (statusCode >= 400) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });
    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileServerHits++;
    next();
}

export function middlewareErrorHandler(err: Error, _req: Request, res: Response, next: NextFunction) {
    if (err instanceof BadRequestError) {
        return res.status(400).json({ "error": err.message });
    } else if (err instanceof UnauthorizedError) {
        return res.status(401).json({ "error": err.message });
    } else if (err instanceof ForbiddenError) {
        return res.status(403).json({ "error": err.message });
    } else if (err instanceof NotFoundError) {
        return res.status(404).json({ "error": err.message });
    }
    return res.status(500).json({ "error": "Something went wrong on our end" });
}
