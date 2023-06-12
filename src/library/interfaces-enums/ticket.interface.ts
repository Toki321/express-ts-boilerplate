import { Document } from 'mongoose';

export interface ITicket extends Document {
    flightNr: string;
    departureDate: Date;
    origin: string;
    destination: string;
    cabin: string;
    price: number;
}
