import { Request, Response } from "express";
import { BadRequestError, ForbiddenError, NotFoundError } from "./errors.js";
import { createChirp, getChirps, getChirpById, deleteChirpById } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerCreateChirps(req: Request, res: Response) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.secret);
    const bodyText = req.body.body;
    if (bodyText.length > 140 ) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const cleanedText = helperProfanityCheck(bodyText);
    const result = await createChirp(cleanedText, userId);
    res.status(201).json(result);
}

function helperProfanityCheck(text: string): string {
    const profanities = ["kerfuffle", "sharbert", "fornax"];
    let textList = text.split(" ");
    for (let i = 0; i < textList.length; i++) {
        const word = textList[i];
        if (profanities.includes(word.toLowerCase())) {
            textList[i] = "****";
        }
    }
    const cleanedText = textList.join(" ");
    return cleanedText;
}

export async function handlerGetChirps(req: Request, res: Response) {
    let authorId: string | undefined = undefined;
    if (typeof req.query.authorId === "string") {
        authorId = req.query.authorId;
    }
    let sort: "asc" | "desc" = "asc";
    if (req.query.sort === "desc") {
        sort = "desc";
    }
    const chirpsList = await getChirps(authorId, sort);
    res.status(200).json(chirpsList);
}

export async function handlerGetChirpById(req: Request, res: Response) {
    if (typeof req.params.chirpId !== "string") {
        throw new BadRequestError("Invalid chirp ID");
    }
    const chirp = await getChirpById(req.params.chirpId);
    if (!chirp) {
        throw new NotFoundError("Chirp not found");
    }
    res.status(200).json(chirp);
}

export async function handlerDeleteChirpById(req: Request, res: Response) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.secret);
    const chirpId = req.params.chirpId;
    if (typeof chirpId !== "string" || !chirpId) {
        throw new BadRequestError("Invalid or no chirp ID");
    }
    const chirp = await getChirpById(chirpId);
    if (!chirp) {
        throw new NotFoundError("Chirp not found");
    }
    if (chirp.userId !== userId) {
        throw new ForbiddenError("You can only delete your own chirps");
    }
    await deleteChirpById(chirpId);
    res.status(204).end();
}
