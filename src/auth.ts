import argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { UnauthorizedError } from "./api/errors.js";
import crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
    const hash = await argon2.hash(password);
    return hash;
    }

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
    }

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const payload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    }
    return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const decoded = jwt.verify(tokenString, secret) as payload;
        if (decoded.sub === undefined) {
            throw new UnauthorizedError("Invalid token: missing subject");
        }
        return decoded.sub;
    }   catch (err) {
        throw new UnauthorizedError("Invalid token");
    }
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new UnauthorizedError("No Authorization header");
    }
    return authHeader.slice(7).trim();
}

export function makeRefreshToken(): string {
    return crypto.randomBytes(32).toString("hex");
}

export function getAPIKey(req: Request): string {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new UnauthorizedError("No Authorization header");
    }
    return authHeader.slice(7).trim();
}