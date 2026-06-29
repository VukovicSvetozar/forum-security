export class ChangeUserGroupRequest {

    userId: number;
    newGroup: string;

    constructor(userId: number, newGroup: string) {
        this.userId = userId;
        this.newGroup = newGroup;
    }

}
