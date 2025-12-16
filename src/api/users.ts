import type { Request, Response, NextFunction } from "express";

import { respondWithJSON } from "./json.js";
import { createUser } from "../lib/db/queries/users.js";
import { BadRequestError } from "./error.js";

export async function handlerUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  type parameters = {
    email: string;
  };

  const params: parameters = req.body;
  if (params.email == undefined || params.email.length == 0) {
    throw new BadRequestError("Missing email parameter in request");
  }

  const user = await createUser({ email: params.email });
  if (user == undefined) {
    throw new BadRequestError("User not created");
  }

  respondWithJSON(res, 201, user);
}
