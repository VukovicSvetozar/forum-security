export class CommentAddRequest {

    content: string;
    username: string;
    topicId: number;

    constructor(
        content: string,
        username: string,
        topicId: number
    ) {
        this.content = content;
        this.username = username;
        this.topicId = topicId;
    }

}
