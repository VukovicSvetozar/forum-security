export class CodeVerificationRequest {

    username: string;
    secretCode: number;
    loginJwtToken: string;

    constructor(username: string, secretCode: number, loginJwtToken: string) {
        this.username = username;
        this.secretCode = secretCode;
        this.loginJwtToken = loginJwtToken;
    }

}
