export class LoginVerificationResponse {

    username: string;
    loginJwtToken: string;

    constructor(
        username: string,
        loginJwtToken: string
    ) {
        this.username = username;
        this.loginJwtToken = loginJwtToken;
    }

}
