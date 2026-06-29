
export class UserVerificationRequest {

    userId: number;
    approved: boolean;
    group: string;

    constructor(
        userId: number,
        approved: boolean,
        group: string
    ) {
        this.userId = userId;
        this.approved = approved;
        this.group = group;
    }

}
