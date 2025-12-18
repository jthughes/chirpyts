import type { Request, Response, NextFunction } from "express";

import { respondWithJSON } from "./json.js";
import {
  createChirp,
  getAllChirps,
  getChirpByID,
} from "../lib/db/queries/chirps.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./error.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";

export async function handlerChirpsAddNew(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const tokenString = getBearerToken(req);
  const userID = validateJWT(tokenString, config.jwtSecret);

  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const chirp = await createChirp(params.body, userID);
  if (chirp == undefined) {
    throw new BadRequestError("Chirp not created");
  }

  respondWithJSON(res, 201, {
    id: chirp.id,
    userId: chirp.user_id,
    body: chirp.body,
  });
}

export async function handlerChirpsGetAll(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const chirps = await getAllChirps();
  if (chirps == undefined) {
    throw new Error("Failed");
  }

  respondWithJSON(res, 200, chirps);
}

export async function handlerChirpGetByID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const chirpID = req.params.chirpID;
  console.log(`url parameter: chirpID = ${chirpID}`);
  const chirp = await getChirpByID(chirpID);
  if (chirp == undefined) {
    throw new Error("Failed");
  } else if (chirp.length == 0) {
    throw new NotFoundError("Chirp not found");
  }

  respondWithJSON(res, 200, chirp[0]);
}
