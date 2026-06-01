import { Request, Response } from "express";
import { getBearerToken } from "../auth.js";
import { revokeRefreshToken } from "../db/queries/refresh.js";

export async function handlerRevoke(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    await revokeRefreshToken(refreshToken);
    return res.status(204).end();
}