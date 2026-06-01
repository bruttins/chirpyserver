import { Request, Response } from "express";
import { getRefreshToken } from "../db/queries/refresh.js";
import { getBearerToken, makeJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    const tokenRow = await getRefreshToken(refreshToken);
    if (!tokenRow) {
        return res.status(401).json({ error: "Invalid refresh token" });
    }
    const newAccessToken = makeJWT(tokenRow.user_id, 3600, config.secret);
    return res.status(200).json({ "token": newAccessToken });
}