import { ApiError } from '../../library/errors/api-error';
import { HttpStatusCode } from '../../library/interfaces-enums/HttpStatusEnum';
import { getUserByEmail } from '../db-helpers-user';

export class RegisterHandler {
    static async findExistingUser(email: string) {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            throw new ApiError('RegistrationError', HttpStatusCode.BAD_REQUEST, 'Invalid creditentials');
        }
    }

    static generateUniqueUsername(email: string) {
        const username = email.split('@')[0]; // Extract username from email
        return `${username}_${Math.floor(Math.random() * 1000)}`; // Append a random number to ensure uniqueness
    }
}
