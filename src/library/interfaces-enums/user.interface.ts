import { IWalletAddress } from './walletAddress.interface';
import { Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    refreshToken: string | null;
    walletAddresses: IWalletAddress[];
    roles: Object[];
    transform: () => IUser;
}
