import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import { config } from '../config/config';
import Logger from './library/logger/winston-logger';
import morganMiddleware from './library/logger/morgan-logger';
import errorHandler from './middleware/error-handler';

import AuthRoutes from './routes/authentication.route';

const app = express();

// autoIndex should be set to false in production? (see mongoose docs)
console.log(`Connecting to ${config.mongo.url}`);
mongoose
    .connect(config.mongo.url)
    .then(() => {
        Logger.info('Connected to mongoDB');
        StartServer();
    })
    .catch(error => {
        Logger.error('Unable to connect: ');
        Logger.error(error);
    });

const StartServer = () => {
    const corsOptions = {
        origin: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000',
        credentials: true,
    };

    app.use(morganMiddleware);
    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(compression());
    app.use(cookieParser());

    /**Routes */
    app.use('/auth', AuthRoutes);

    /**Healthcheck */
    app.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /** Error handling */
    app.use(errorHandler);

    http.createServer(app).listen(config.server.port, () =>
        Logger.info(`Server running on port ${config.server.port}`),
    );
};
