import { config } from '../config.js';
import { Request, Response } from 'express';

export function saveMetrics(_req: Request, res: Response) {
    res.send(`Hits: ${config.fileServerHits}`);
}