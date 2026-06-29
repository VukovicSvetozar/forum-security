export class UserProfileRequest {

	username: string;
	newPassword: string;
	oldPassword: string;
    email: string;
	avatarUrl: string;

	constructor(
		username: string,
		newPassword: string,
		oldPassword: string,
        email: string,
		avatarUrl: string
	) {
		this.username = username;
		this.newPassword = newPassword;
		this.oldPassword = oldPassword;
        this.email = email;
		this.avatarUrl = avatarUrl;
	}

}
