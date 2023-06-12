import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { BaseError } from '../library/errors/base-error';
import Logger from '../library/logger/winston-logger';

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    Logger.error(error);

    if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Handle custom errors
    if (error instanceof BaseError) {
        return res.status(error.httpCode).json({ error: error });
    }

    // Handle default error
    res.status(500).json({ error: error.message });
};

export default errorHandler;
