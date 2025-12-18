import type { Request, Response, NextFunction } from "express";

import { respondWithJSON } from "./json.js";
import { getUserByEmail } from "../lib/db/queries/users.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./error.js";
import { checkPasswordHash, makeJWT } from "./auth.js";
import { NewUser } from "../lib/db/schema.js";
import { config } from "../config.js";

export async function handlerLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  type parameters = {
    email: string;
    password: string;
    expiresInSeconds?: number;
  };

  const params: parameters = req.body;
  if (params.email == undefined || params.email.length == 0) {
    throw new BadRequestError("Missing email parameter in request");
  }
  if (params.password == undefined || params.password.length == 0) {
    throw new BadRequestError("Missing password parameter in request");
  }
  if (params.expiresInSeconds == undefined || params.expiresInSeconds > 3600) {
    params.expiresInSeconds = 3600;
  }
  const user = await getUserByEmail(params.email);
  if (user == undefined) {
    throw new NotFoundError("User not found");
  }

  const verifed = await checkPasswordHash(params.password, user.hashedPassword);
  if (!verifed) {
    throw new UnauthorizedError("password did not match");
  }

  const token = makeJWT(user.id, params.expiresInSeconds, config.jwtSecret);

  interface UserReponse extends Omit<NewUser, "hashedPassword"> {
    token: string;
  }

  const responseUser: UserReponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: token,
  };

  respondWithJSON(res, 200, responseUser);
}
