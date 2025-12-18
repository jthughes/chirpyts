import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

import { BadRequestError, UnauthorizedError } from "./error.js";
import { Request } from "express";

export async function hashPassword(password: string): Promise<string> {
  const hash = await argon2.hash(password);
  return hash;
}

export async function checkPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
  const result = await argon2.verify(hash, password);
  return result;
}

type payload = Pick<jwt.JwtPayload, "iss" | "sub" | "iat" | "exp">;
const TOKEN_ISSUER = "chirpy";

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  const iat = Math.floor(Date.now() / 1000);
  const payload: payload = {
    iss: TOKEN_ISSUER,
    sub: userID,
    iat: iat,
    exp: iat + expiresIn,
  };
  const token = jwt.sign(payload, secret, { algorithm: "HS256" });
  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  let decoded: payload;
  try {
    decoded = jwt.verify(tokenString, secret) as jwt.JwtPayload;
  } catch (err) {
    throw new UnauthorizedError("Invalid token");
  }
  if (decoded.iss != TOKEN_ISSUER) {
    throw new UnauthorizedError("Invalid Issuer");
  }

  if (!decoded.sub) {
    throw new UnauthorizedError("No user ID in token");
  }
  return decoded.sub;
}

export function getBearerToken(req: Request): string {
  const authHeader = req.get("Authorization");
  if (authHeader == undefined) {
    throw new BadRequestError("missing Authorization header");
  }
  const authHeaderComponents = authHeader.split(" ");
  if (
    authHeaderComponents.length !== 2 &&
    authHeaderComponents[0] !== "Bearer"
  ) {
    throw new BadRequestError("invalid Authorization format");
  }
  return authHeaderComponents[1];
}
