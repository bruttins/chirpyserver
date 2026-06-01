import { Request, Response } from "express";
import { createUser, updateUserEmailAndPassword } from "../db/queries/users.js";
import { hashPassword, validateJWT, getBearerToken } from "../auth.js";
import { config } from "../config.js";

export async function handlerCreateUser(req: Request, res: Response) {
    const email = req.body.email;
    const pwd = req.body.password;
    if (!email || !pwd) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    const hashed_password = await hashPassword(pwd);
    const user = await createUser({email, hashed_password});
    if (!user) {
        return res.status(409).json({ error: "User could not be created" });
    }
    const { hashed_password: removedHashedPW, is_chirpy_red, ...safeUser } = user;
    return res.status(201).json({ ...safeUser, isChirpyRed: is_chirpy_red });
}

export async function handlerUpdateEMailAndPassword(req: Request, res: Response) {
    const tokenString = getBearerToken(req);
    const userID = validateJWT(tokenString, config.secret);
    const email = req.body.email;
    const pwd = req.body.password;
    if (!email || !pwd) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    const hashed_password = await hashPassword(pwd);
    const user = await updateUserEmailAndPassword(userID, email, hashed_password);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const { hashed_password: removedHashedPW, is_chirpy_red, ...safeUser } = user;
    return res.status(200).json({ ...safeUser, isChirpyRed: is_chirpy_red });
}