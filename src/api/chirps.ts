import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";

export async function handlerChirpsValidate(req: Request, res: Response) {
const bodyText = req.body.body;
        if (bodyText.length > 140 ) {
            throw new BadRequestError("Chirp is too long. Max length is 140");
        } else {
            const cleanedText = helperProfanityCheck(bodyText);
            return res.status(200).send({"cleanedBody": cleanedText});
        }
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