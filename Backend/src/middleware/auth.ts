import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

interface TokenPayload {
  id: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ error: "No token" });
    return;
  }

  const token = header.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Bad token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as TokenPayload;
    if (!decoded?.id) {
      res.status(401).json({ error: "Token broken" });
      return;
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
