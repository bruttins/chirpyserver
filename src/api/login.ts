import { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../auth.js";
import { config } from "../config.js";
import { saveRefreshToken } from "../db/queries/refresh.js";

export async function handlerLogin(req: Request, res: Response) {
    const email = req.body.email;
    const pwd = req.body.password;
    const expiration = 3600;
    if (!email || !pwd) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await getUserByEmail(email);
    if (!user || !await checkPasswordHash(pwd, user.hashed_password)) {
        return res.status(401).json({ error: "incorrect email or password" });
    }
    const { hashed_password: removedHashedPW, is_chirpy_red, ...safeUser } = user;
    const token = makeJWT(user.id, expiration, config.secret);
    const refreshToken = makeRefreshToken();
    const sixtyDaysMs = 60 * 24 * 60 * 60 * 1000;
    await saveRefreshToken(refreshToken, user.id, new Date(Date.now() + sixtyDaysMs));
    
    return res.status(200).json({ ...safeUser, isChirpyRed: is_chirpy_red, token, refreshToken });
}