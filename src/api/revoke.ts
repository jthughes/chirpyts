import type { Request, Response, NextFunction } from "express";

import { BadRequestError, UnauthorizedError } from "./error.js";
import { getBearerToken } from "./auth.js";
import {
  getRefreshTokenByToken,
  markTokenAsRevoked,
} from "../lib/db/queries/refresh_tokens.js";

export async function handlerRevoke(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const refreshToken = getBearerToken(req);

  const entry = await getRefreshTokenByToken(refreshToken);
  if (entry == undefined) {
    throw new UnauthorizedError("token not found");
  }

  if (entry.revoked_at != null) {
    throw new UnauthorizedError("token has been revoked");
  }

  if (entry.expires_at.getTime() < Date.now()) {
    throw new UnauthorizedError("token has expired");
  }

  const result = await markTokenAsRevoked(refreshToken);
  if (result == undefined || result.revoked_at == null) {
    throw new BadRequestError("unable to mark token as revoked");
  }
  res.status(204).send();
}
