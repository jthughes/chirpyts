import type { Request, Response, NextFunction } from "express";

import { NotFoundError, UnauthorizedError } from "./error.js";

import { getUserByID, setChirpyRedStatus } from "../lib/db/queries/users.js";
import { getAPIKey } from "./auth.js";
import { config } from "../config.js";

export async function handlerWebhookPolka(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const apiKey = getAPIKey(req);
  if (apiKey != config.polkaSecret) {
    throw new UnauthorizedError("apikey does not match");
  }

  type parameters = {
    event: string;
    data: {
      userId: string;
    };
  };

  const params: parameters = req.body;

  if (params.event == undefined || params.event != "user.upgraded") {
    res.status(204).send();
    return;
  }
  if (params.data == undefined || params.data.userId == undefined) {
    throw new NotFoundError("invalid format");
  }

  const user = await getUserByID(params.data.userId);
  if (user == undefined) {
    throw new NotFoundError("user not found");
  }

  const status = await setChirpyRedStatus(user.id, true);
  if (status == undefined) {
    throw new NotFoundError("error setting status");
  }

  res.status(204).send();
}
