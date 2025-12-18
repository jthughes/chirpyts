import type { Request, Response, NextFunction } from "express";

import { respondWithJSON } from "./json.js";
import { createUser } from "../lib/db/queries/users.js";
import { BadRequestError } from "./error.js";
import { PassThrough } from "node:stream";
import { hashPassword } from "./auth.js";
import { NewUser } from "src/lib/db/schema.js";

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
  };

  respondWithJSON(res, 201, responseUser);
}
