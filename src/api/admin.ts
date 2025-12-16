import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { deleteAllUsers } from "../lib/db/queries/users.js";

import { respondWithJSON } from "./json.js";
import { ForbiddenError } from "./error.js";

export async function handlerAdminReset(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (config.platform != "dev") {
    throw new ForbiddenError("forbidden on this platform");
  }
  config.fileserverHits = 0;
  deleteAllUsers();
  respondWithJSON(res, 200, "deleted");
}
