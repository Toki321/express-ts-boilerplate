import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../../config/config';
import { UnauthorizedError } from '../library/errors/unauthorized';

export const verifyAccessToken = (req: Request | any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedError('Invalid token');

    const token = authHeader && authHeader.split(' ')[1];

    console.log(`authHeader: ${authHeader}`);
    console.log(`token: ${token}`);

    if (!token) {
        throw new UnauthorizedError('Invalid token');
    }

    jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err: any, decoded: any) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                next(err);
            }
            throw new UnauthorizedError('Invalid token');
        }
        req.user = decoded.UserInfo.roles;
        req.roles = decoded.UserInfo.roles;
        next();
    });
};
