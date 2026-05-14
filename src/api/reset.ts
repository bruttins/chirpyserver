import { config } from '../config.js';
import { Request, Response } from 'express';

export function handlerResetMetrics(_req: Request, res: Response) {
    config.fileServerHits = 0;
    res.send("Server hits reset to 0");
}