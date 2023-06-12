import { Request, Response, NextFunction } from 'express';

export const tryCatchController = (controller: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await controller(req, res);
  } catch (error) {
    next(error);
  }
};

export const tryCatchMiddleware = (middleware: any) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await middleware(req, res, next);
  } catch (error) {
    next(error);
  }
};
