import type { Request, Response, NextFunction } from "express";

import { respondWithJSON } from "./json.js";
import { UnauthorizedError } from "./error.js";
import { getBearerToken, makeJWT } from "./auth.js";
import { config } from "../config.js";
import { getRefreshTokenByToken } from "../lib/db/queries/refresh_tokens.js";

export async function handlerRefresh(
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

  const token = makeJWT(entry.user_id, 3600, config.jwtSecret);

  respondWithJSON(res, 200, { token: token });
}
