export class CommentCorrectionResponse {

    id: number;
    correctionTime: Date;
    correctionUsername: string;
    commentCreatorUsername: string;

    constructor(
        id: number,
        correctionTime: Date,
        correctionUsername: string,
        commentCreatorUsername: string
    ) {
        this.id = id;
        this.correctionTime = correctionTime;
        this.correctionUsername = correctionUsername;
        this.commentCreatorUsername = commentCreatorUsername;
    }

}
