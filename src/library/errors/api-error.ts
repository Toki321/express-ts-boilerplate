import { HttpStatusCode } from '../interfaces-enums/HttpStatusEnum';
import { BaseError } from './base-error';

export class ApiError extends BaseError {
    constructor(name: string, httpCode: HttpStatusCode, description: string) {
        super(name, httpCode, description, true);
    }
}
