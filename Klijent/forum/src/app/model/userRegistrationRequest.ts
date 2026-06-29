export class UserRegistrationRequest {

    username: string;
    password: string;
    email: string;
    avatarUrl: string;

    constructor(
        username: string,
        password: string,
        email: string,
        avatarUrl: string
    ) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

}
