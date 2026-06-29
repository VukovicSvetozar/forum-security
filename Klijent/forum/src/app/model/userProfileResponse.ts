export class UserProfileResponse {

    username: string;
    email: string;
    avatarUrl: string;

    constructor(
        username: string,
        email: string,
        avatarUrl: string
    ) {
        this.username = username;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

}

