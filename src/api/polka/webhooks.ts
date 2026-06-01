import { updateUserIsChirpyRed } from "../../db/queries/users.js";
import { Request, Response } from "express";
import { getAPIKey } from "../../auth.js";
import { config } from "../../config.js";

export async function handlerWebhookChirpyRed(req: Request, res: Response) {
    const apiKey = getAPIKey(req);
    if (apiKey !== config.api.polkaKey) {
        return res.status(401).end();
    }

    const event = req.body?.event;
    if (event !== "user.upgraded") {
        return res.status(204).end();
    }

    if (!req.body.data || !req.body.data.userId) {
        return res.status(400).end();
    }

    const userId = req.body.data.userId;
    const user = await updateUserIsChirpyRed(userId);
    if (!user) {
        return res.status(404).end();
    }
    return res.status(204).end();
}