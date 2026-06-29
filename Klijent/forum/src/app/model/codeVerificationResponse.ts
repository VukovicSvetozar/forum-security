export class CodeVerificationResponse {

    username: string;
    group: string;
    avatarUrl: string;
    jwtToken: string;
    refreshJwtToken: string;

    constructor(
        username: string,
        group: string,
        avatarUrl: string,
        jwtToken: string,
        refreshJwtToken: string
    ) {
        this.username = username;
        this.group = group;
        this.avatarUrl = avatarUrl;
        this.jwtToken = jwtToken;
        this.refreshJwtToken = refreshJwtToken;
    }

}
