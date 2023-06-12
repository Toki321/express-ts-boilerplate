import jwt from 'jsonwebtoken';
import { config } from '../../../config/config';
import { ApiError } from '../../library/errors/api-error';
import { ResourceNotFound } from '../../library/errors/resource-not-found';
import { HttpStatusCode } from '../../library/interfaces-enums/HttpStatusEnum';
import { IUser } from '../../library/interfaces-enums/user.interface';
import { getUserByRefreshToken, saveRefreshTokenToDB } from '../db-helpers-user';

export class JWTHandler {
    static async findUserByToken(refreshToken: string) {
        const foundUser = await getUserByRefreshToken(refreshToken);
        if (!foundUser) throw new ResourceNotFound(`Resource not found`);
        return foundUser;
    }

    static async verifyAndDecodeToken(refreshToken: string, user: IUser) {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err: any, decoded: any) => {
                if (err || user.username !== decoded.username)
                    reject(new ApiError('BadJWT', HttpStatusCode.FORBIDDEN, `Invalid token`));
                else resolve(decoded);
            });
        });
    }

    static signNewTokens(user: IUser) {
        const roles = Object.values(user.roles);

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: user.username,
                    roles: roles,
                },
            },
            config.ACCESS_TOKEN_SECRET,
            { expiresIn: config.expiration.accessTokenExpiration },
        );

        const refreshToken = jwt.sign({ username: user.username }, config.REFRESH_TOKEN_SECRET, {
            expiresIn: config.expiration.refreshTokenExpiration,
        });

        return { accessToken, refreshToken };
    }

    static async saveRefreshToken(user: IUser, refreshToken: string) {
        await saveRefreshTokenToDB(user, refreshToken);
    }
}
