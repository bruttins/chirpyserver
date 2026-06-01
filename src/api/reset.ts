import { config } from '../config.js';
import { Request, Response } from 'express';
import { deleteAllUsers } from '../db/queries/users.js';
import { ForbiddenError } from './errors.js';

export async function handlerResetMetrics(_req: Request, res: Response) {
    if (config.platform !== "dev") {
        throw new ForbiddenError("Resetting metrics is only allowed in dev environment");
    }
    config.api.fileServerHits = 0;
    await deleteAllUsers();

    res.send("Server hits reset to 0, all users deleted");
}