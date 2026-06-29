export class TopicDataResponse {

    id: number;
    name: string;
    imageUrl: string;
    totalComments: number;
    lastCommentTime: Date;

    constructor(
        id: number,
        name: string,
        imageUrl: string,
        totalComments: number,
        lastCommentTime: Date
    ) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.totalComments = totalComments;
        this.lastCommentTime = lastCommentTime;
    }

}