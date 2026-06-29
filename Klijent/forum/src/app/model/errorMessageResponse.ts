export class ErrorMessageResponse {

    id: number;
    status: string;
    time: string;
    requestUrl: string;
    method: string;
    clientIp: string;
    messages: { [key: string]: string };
    fieldErrors: { [key: string]: any };

    constructor(
        id: number,
        status: string,
        time: string,
        requestUrl: string,
        method: string,
        clientIp: string,
        messages: { [key: string]: string },
        fieldErrors: { [key: string]: any }
    ) {
        this.id = id;
        this.status = status;
        this.time = time;
        this.requestUrl = requestUrl;
        this.method = method;
        this.clientIp = clientIp;
        this.messages = messages;
        this.fieldErrors = fieldErrors;
    }

}
