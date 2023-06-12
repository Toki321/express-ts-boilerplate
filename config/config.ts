import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';

dotenv.config();

// const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
// const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
// const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@freecluster.5y8fgvd.mongodb.net/?retryWrites=true&w=majority`;

const MONGO_URL = `mongodb://127.0.0.1:27017/nft4flyDB?directConnection=true&serverSelectionTimeoutMS=2000&appName=nft4fly`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;
const saltWorkFactor = 10;

const ACCESS_TOKEN_SECRET: Secret = process.env.ACCESS_TOKEN_SECRET || 'defaultSecret';
const REFRESH_TOKEN_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET || 'defaultSecret';

export const config = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    },
    expiration: {
        accessTokenExpiration: '15m',
        refreshTokenExpiration: '1d',
    },
    saltWorkFactor,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
};
