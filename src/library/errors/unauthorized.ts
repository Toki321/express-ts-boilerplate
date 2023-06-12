import { HttpStatusCode } from '../interfaces-enums/HttpStatusEnum';
import { BaseError } from './base-error';

export class UnauthorizedError extends BaseError {
    constructor(description: string) {
        super('UnauthorizedError', HttpStatusCode.UNAUTHORIZED, description, true);
    }
}
