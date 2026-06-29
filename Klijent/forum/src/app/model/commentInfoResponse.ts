export class CommentInfoResponse {

    id: number;
    content: string;
    postedTime: Date;
    correctionTime: Date;
    correctionUsername: string;
    userId: number;
    username: string;
    avatarUrl: string;
    accessDate: Date;
    totalPosts: number;

    constructor(
        id: number,
        content: string,
        postedTime: Date,
        correctionTime: Date,
        correctionUsername: string,
        userId: number,
        username: string,
        avatarUrl: string,
        accessDate: Date,
        totalPosts: number
    ) {
        this.id = id;
        this.content = content;
        this.postedTime = postedTime;
        this.correctionTime = correctionTime;
        this.correctionUsername = correctionUsername;
        this.userId = userId;
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.accessDate = accessDate;
        this.totalPosts = totalPosts;
    }

}
