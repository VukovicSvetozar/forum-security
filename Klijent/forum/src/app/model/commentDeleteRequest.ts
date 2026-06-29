export class CommentDeleteRequest {

    id: number;
    commentCreatorUsername: string;

    constructor(
        id: number,
        commentCreatorUsername: string
    ) {
        this.id = id;
        this.commentCreatorUsername = commentCreatorUsername;
    }

}
