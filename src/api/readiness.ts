import type { Request, Response, NextFunction } from "express";

export async function handlerReadiness(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
  res.status(200);
}
