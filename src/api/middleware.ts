import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "./error.js";
import { getBearerToken, validateJWT } from "./auth.js";

export async function middlewareLogging(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on("finish", () => {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`,
      );
    }
  });
  next();
}

export async function middlewareMetricsInc(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  config.fileserverHits += 1;
  next();
}

export async function middlewareError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError
  ) {
    respondWithError(res, err.status, err.message);
  } else {
    console.log(err);
    respondWithError(res, 500, "Internal Server Error");
  }
}

export function fakeMiddlewareAuth(req: Request): string {
  const tokenString = getBearerToken(req);
  const userID = validateJWT(tokenString, config.jwtSecret);
  return userID;
}
