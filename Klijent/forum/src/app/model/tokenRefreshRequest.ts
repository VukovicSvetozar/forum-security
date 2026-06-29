export class TokenRefreshRequest {

    refreshJwtToken: string;

    constructor(
        refreshJwtToken: string
    ) {
        this.refreshJwtToken = refreshJwtToken;
    }

}
