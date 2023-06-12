import { IUser } from '../library/interfaces-enums/user.interface';
import UserModel from '../models/user.model';

export const getUserByEmail = async (email: string) => await UserModel.findOne({ email }).select('+password');

export const getUserByUsername = async (username: string) => await UserModel.findOne({ username }).select('+password');

export const getUserByRefreshToken = async (refreshToken: string): Promise<IUser | null> =>
    await UserModel.findOne({ refreshToken }).select('+password');

export const saveRefreshTokenToDB = async (user: IUser, refreshToken: string) => {
    user.refreshToken = refreshToken;
    return await user.save();
};

export const saveUserToDb = async (email: string, username: string, password: string) => {
    const user: IUser = new UserModel({
        email,
        username,
        password,
    });
    return await user.save();
};

export const isEmailExisting = async (email: string): Promise<boolean> => {
    const user = await UserModel.findOne({ email });
    return user ? false : true;
};

export const deleteRefreshToken = async (user: IUser) => {
    user.refreshToken = null;
    return await user.save();
};
