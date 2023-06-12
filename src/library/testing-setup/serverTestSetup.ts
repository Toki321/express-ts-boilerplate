import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import morganMiddleware from '../logger/morgan-logger';
import errorHandler from '../../middleware/error-handler';

import AuthRoutes from '../../routes/authentication.route';

const app = express();

const StartTestServer = () => {
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

    // no ports, because multiple tests will use the same port and show error
    http.createServer(app);

    return app;
};

export { StartTestServer };
