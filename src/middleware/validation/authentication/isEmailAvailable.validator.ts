import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Create Joi schema for email validation
const schema = Joi.object({
    email: Joi.string().email().required(),
});

export const validateEmailQuery = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);

    if (error) {
        console.error(`Error validating email query: ${error}`);
        next(error);
    }
    next();
};
