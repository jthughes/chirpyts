import type { Request, Response, NextFunction } from "express";

import { respondWithJSON } from "./json.js";
import { getUserByEmail } from "../lib/db/queries/users.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./error.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "./auth.js";
import { NewUser } from "../lib/db/schema.js";
import { config } from "../config.js";
import { storeRefreshToken } from "../lib/db/queries/refresh_tokens.js";

export async function handlerLogin(
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
  const user = await getUserByEmail(params.email);
  if (user == undefined) {
    throw new NotFoundError("User not found");
  }

  const verifed = await checkPasswordHash(params.password, user.hashedPassword);
  if (!verifed) {
    throw new UnauthorizedError("password did not match");
  }

  const token = makeJWT(user.id, 3600, config.jwtSecret);

  const refreshToken = makeRefreshToken();
  const storedToken = storeRefreshToken(refreshToken, user.id, 60 * 60 * 24);
  if (storedToken == undefined) {
    throw new Error("unable to store refresh token");
  }

  interface UserReponse extends Omit<NewUser, "hashedPassword"> {
    token: string;
    refreshToken: string;
  }

  const responseUser: UserReponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: token,
    refreshToken: refreshToken,
  };

  respondWithJSON(res, 200, responseUser);
}
