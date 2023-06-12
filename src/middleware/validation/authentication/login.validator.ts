import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const userSchema = Joi.alternatives().try(
    Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string()
            // .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
            .required(),
    }),
    Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
            // .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
            .required(),
    }),
);

export const validateLoginInput = (req: Request, res: Response, next: NextFunction) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        console.log(`Error validating login input: `, error.message);
        next(error);
    }
    console.log(`Login input validated successfully!`);
    next();
};
