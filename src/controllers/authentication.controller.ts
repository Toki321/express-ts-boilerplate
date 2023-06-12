import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

// helper functions
import {
    deleteRefreshToken,
    getUserByEmail,
    getUserByRefreshToken,
    isEmailExisting,
    saveRefreshTokenToDB,
    saveUserToDb,
} from '../utils/db-helpers-user';

// custom errors
import { ApiError } from '../library/errors/api-error';

// constants
import { HttpStatusCode } from '../library/interfaces-enums/HttpStatusEnum';
import { IUser } from '../library/interfaces-enums/user.interface';

// config
import { config } from '../../config/config';
import { LoginHandler } from '../utils/authentication/login-handler';
import { RegisterHandler } from '../utils/authentication/register-handler';
import { JWTHandler } from '../utils/authentication/jwt-handler';

const login = async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    const foundUser = await LoginHandler.findUser(email, username);
    await LoginHandler.validatePassword(foundUser, password);

    const { accessToken, refreshToken } = JWTHandler.signNewTokens(foundUser);

    await saveRefreshTokenToDB(foundUser, refreshToken);

    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ accessToken });
};

const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    await RegisterHandler.findExistingUser(email);

    const username = RegisterHandler.generateUniqueUsername(email);

    const hashedPassword = await bcrypt.hash(password, config.saltWorkFactor);

    const savedUser: IUser = await saveUserToDb(email, username, hashedPassword);

    res.status(200).json({ user: savedUser.transform() });
};

const useRefreshToken = async (req: Request, res: Response) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) throw new ApiError('NoRefreshToken', HttpStatusCode.BAD_REQUEST, 'Token not found');

    const refreshToken = cookies.jwt;

    const foundUser = await JWTHandler.findUserByToken(refreshToken);

    await JWTHandler.verifyAndDecodeToken(refreshToken, foundUser);

    const { accessToken, refreshToken: newRefreshToken } = JWTHandler.signNewTokens(foundUser);

    res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day

    await JWTHandler.saveRefreshToken(foundUser, newRefreshToken);

    res.status(200).json({ accessToken });
};

export const logout = async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204).json({ message: 'already logged out' }); //No content
    const refreshToken = cookies.jwt;

    const foundUser = await getUserByRefreshToken(refreshToken);

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, secure: true });
        return res.sendStatus(204).json({ message: 'logout successful' });
    }

    await deleteRefreshToken(foundUser);
    res.clearCookie('jwt', { httpOnly: true, secure: true });
    return res.sendStatus(204).json({ message: 'logout successful' });
};

const isEmailAvailable = async (req: Request, res: Response) => {
    const email = req.query.email;

    console.log(`email: ${email}`);

    if (!email) throw new ApiError('BadRequest', HttpStatusCode.BAD_REQUEST, 'Email missing');

    const emailExists = await isEmailExisting(String(email));

    return res.status(200).json({ isValid: emailExists });
};

export default { login, register, useRefreshToken, logout, isEmailAvailable };
