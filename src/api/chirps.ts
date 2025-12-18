import type { Request, Response, NextFunction } from "express";

import { respondWithJSON } from "./json.js";
import {
  createChirp,
  deleteChirpByID,
  getAllChirps,
  getAllChirpsByAuthorID,
  getChirpByID,
} from "../lib/db/queries/chirps.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "./error.js";
import { fakeMiddlewareAuth } from "./middleware.js";

export async function handlerChirpsAddNew(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let userID: string;
  try {
    userID = fakeMiddlewareAuth(req);
  } catch {
    throw new UnauthorizedError("failed to authenticate user");
  }

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
  let authorId = "";
  let authorIdQuery = req.query.authorId;
  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
  }

  let sortDesc = false;
  let sortDirQuery = req.query.sort;
  if (typeof sortDirQuery === "string" && sortDirQuery == "desc") {
    sortDesc = true;
  }

  if (authorId == "") {
    const chirps = await getAllChirps(sortDesc);
    if (chirps == undefined) {
      throw new Error("Failed");
    }

    respondWithJSON(res, 200, chirps);
    return;
  }

  const chirps = await getAllChirpsByAuthorID(authorId, sortDesc);
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
    throw new NotFoundError("Chirp not found");
  }

  respondWithJSON(res, 200, chirp);
}

export async function handlerDeleteChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let userID: string;
  try {
    userID = fakeMiddlewareAuth(req);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      throw new ForbiddenError("failed to authenticate user");
    } else {
      throw new UnauthorizedError("invalid auth header");
    }
    console.log(err);
  }

  const chirpID = req.params.chirpID;

  const chirp = await getChirpByID(chirpID);
  if (chirp == undefined) {
    throw new NotFoundError("chirp not found");
  }
  if (chirp.user_id !== userID) {
    throw new ForbiddenError("user does not own chirp");
  }
  await deleteChirpByID(chirpID);

  res.status(204).send();
}
