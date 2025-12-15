import type { Request, Response, NextFunction } from "express";

import { respondWithError, respondWithJSON } from "./json.js";

export async function handlerValidateChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
  }
  const filter = ["kerfuffle", "sharbert", "fornax"];
  const input = params.body.split(" ");

  for (let i = 0; i < input.length; i++) {
    if (filter.includes(input[i].toLowerCase())) {
      input[i] = "****";
    }
  }
  const output = input.join(" ");
  respondWithJSON(res, 200, { cleanedBody: output });
}
