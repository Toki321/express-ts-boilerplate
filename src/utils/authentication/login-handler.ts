import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../library/errors/unauthorized';
import { IUser } from '../../library/interfaces-enums/user.interface';
import { getUserByEmail, getUserByUsername } from '../db-helpers-user';
import { ResourceNotFound } from '../../library/errors/resource-not-found';
import { config } from '../../../config/config';

export class LoginHandler {
    static async findUser(email: string, username: string) {
        let user = null;
        if (email) {
            user = await getUserByEmail(email);
        } else if (username) {
            user = await getUserByUsername(username);
        }

        if (!user) {
            throw new ResourceNotFound(`User not found with these credentials.`);
        }
        return user;
    }

    static async validatePassword(user: IUser, password: string) {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new UnauthorizedError('Invalid password');
        }
    }

    // static setRefreshTokenCookie(res: any, refreshToken: string) {
    //     res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    // }
}
