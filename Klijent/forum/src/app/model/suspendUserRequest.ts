export class SuspendUserRequest {

    userId: number;
    suspendExpiration: string;

    constructor(
        userId: number,
        suspendExpiration: string
    ) {
        this.userId = userId;
        this.suspendExpiration = suspendExpiration;
    }

}
