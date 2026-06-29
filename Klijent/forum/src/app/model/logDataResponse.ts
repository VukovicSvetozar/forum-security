export class LogDataResponse {

    date: Date;
    message: string;
    type: string;

    constructor(
        date: Date,
        message: string,
        type: string
    ) {
        this.date = date;
        this.message = message;
        this.type = type;
    }

}