export class ChangePermissionsRequest {

    userId: number;
    newPermissions: string[];

    constructor(userId: number, newPermissions: string[]) {
        this.userId = userId;
        this.newPermissions = newPermissions;
    }

}
