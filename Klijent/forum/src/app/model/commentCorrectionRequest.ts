export class CommentCorrectionRequest {

    id: number;
    content: string;
    correctionUsername: string;
    commentCreatorUsername: string;

    constructor(
        id: number,
        content: string,
        correctionUsername: string,
        commentCreatorUsername: string
    ) {
        this.id = id;
        this.content = content;
        this.correctionUsername = correctionUsername;
        this.commentCreatorUsername = commentCreatorUsername;
    }

}
