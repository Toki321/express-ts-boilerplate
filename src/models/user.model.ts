import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../library/interfaces-enums/user.interface';
import { IWalletAddress } from '../library/interfaces-enums/walletAddress.interface';
import { ROLES_LIST } from '../../config/roles';

const WalletSchema: Schema<IWalletAddress> = new Schema<IWalletAddress>({
    address: {
        type: String,
        required: true,
    },
});

const UserSchema: Schema<IUser & Document> = new Schema<IUser & Document>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: false,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: false,
        unique: false,
    },
    walletAddresses: {
        type: [WalletSchema],
        required: true,
        default: [],
    },
    roles: {
        type: [Object],
        required: true,
        default: [{ User: ROLES_LIST.User }],
    },
});

UserSchema.methods.transform = function () {
    const user = this.toObject();
    delete user.password;
    delete user.refreshToken;
    delete user.roles;
    return user;
};

const UserModel = mongoose.model<IUser & Document>('User', UserSchema);

export default UserModel;
