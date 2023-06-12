import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        // .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'))
        .required(),
});

export const validateRegisterInput = (req: Request, res: Response, next: NextFunction) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        console.log(`Error validating register input: `, error.message);
        next(error);
    }
    console.log(`Register input validated successfully!`);
    next();
};
