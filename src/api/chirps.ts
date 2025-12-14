import type { Request, Response, NextFunction } from "express";
import { parse } from "path/win32";

export async function handlerValidateChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      type chirp = {
        body: string;
      };
      const parseBody: chirp = JSON.parse(body);
      if (parseBody.body.length > 140) {
        throw new Error("Chirp is too long");
      }
      res.status(200).send({ valid: true });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      }
    }
  });
}
