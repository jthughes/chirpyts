import type { Request, Response, NextFunction } from "express";

import { respondWithJSON } from "./json.js";
import { createUser, updateUser } from "../lib/db/queries/users.js";
import { BadRequestError, UnauthorizedError } from "./error.js";
import { PassThrough } from "node:stream";
import { getBearerToken, hashPassword, validateJWT } from "./auth.js";
import { NewUser } from "src/lib/db/schema.js";
import { fakeMiddlewareAuth } from "./middleware.js";

export async function handlerUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;
  if (params.email == undefined || params.email.length == 0) {
    throw new BadRequestError("Missing email parameter in request");
  }
  if (params.password == undefined || params.password.length == 0) {
    throw new BadRequestError("Missing password parameter in request");
  }

  const hash = await hashPassword(params.password); // Throws if hash fails

  const user = await createUser({
    email: params.email,
    hashedPassword: hash,
  });

  if (user == undefined) {
    throw new BadRequestError("User not created");
  }

  type UserReponse = Omit<NewUser, "hashedPassword">;
  const responseUser: UserReponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    isChirpyRed: user.isChirpyRed,
  };

  respondWithJSON(res, 201, responseUser);
}

export async function handlerUpdateUser(
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
    email: string;
    password: string;
  };

  const params: parameters = req.body;
  if (params.email == undefined || params.email.length == 0) {
    throw new BadRequestError("Missing email parameter in request");
  }
  if (params.password == undefined || params.password.length == 0) {
    throw new BadRequestError("Missing password parameter in request");
  }

  const hash = await hashPassword(params.password); // Throws if hash fails

  const user = await updateUser(userID, params.email, hash);

  if (user == undefined) {
    throw new BadRequestError("User not created");
  }

  type UserReponse = Omit<NewUser, "hashedPassword">;
  const responseUser: UserReponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    isChirpyRed: user.isChirpyRed,
  };

  respondWithJSON(res, 200, responseUser);
}
