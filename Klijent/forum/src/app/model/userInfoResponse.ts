export class UserInfoResponse {

    id: number;
    username: string;
    email: string;
    accessDate: Date;
    lastVisit: Date;
    totalPosts: number;
    avatarUrl: string;
    group: string;

    constructor(
        id: number,
        username: string,
        email: string,
        accessDate: Date,
        lastVisit: Date,
        totalPosts: number,
        avatarUrl: string,
        group: string
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.accessDate = accessDate;
        this.lastVisit = lastVisit;
        this.totalPosts = totalPosts;
        this.avatarUrl = avatarUrl;
        this.group = group
    }

}