import "dotenv/config";
import { Request, Response } from "express";

export const render = (req: Request, res: Response, page: string, options?: { [key: string]: any }) => {
  return res.render(page, {
    domain: `${req.protocol}://${req.headers.host}`,
    ...options
  });
}