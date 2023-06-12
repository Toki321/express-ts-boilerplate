import express from 'express';
import UserController from '../controllers/authentication.controller';
import { tryCatchController } from '../utils/try-catch';
import { validateLoginInput } from '../middleware/validation/authentication/login.validator';
import { validateRegisterInput } from '../middleware/validation/authentication/register.validator';
import { validateEmailQuery } from '../middleware/validation/authentication/isEmailAvailable.validator';

const router = express.Router();

const login = tryCatchController(UserController.login);
const register = tryCatchController(UserController.register);
const useRefreshToken = tryCatchController(UserController.useRefreshToken);
const logout = tryCatchController(UserController.logout);
const isEmailAvailable = tryCatchController(UserController.isEmailAvailable);

router.post('/login', validateLoginInput, login);
router.post('/register', validateRegisterInput, register); // may need to use creditentials option if using fetch
router.delete('/logout', logout);
router.get('/useRefreshToken', useRefreshToken);
router.get('/isEmailAvailable', validateEmailQuery, isEmailAvailable);

export default router;
