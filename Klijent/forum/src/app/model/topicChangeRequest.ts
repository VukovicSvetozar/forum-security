export class TopicChangeRequest {

    id: number;
    name: string;
    imageUrl: string;

    constructor(
        id: number,
        name: string,
        imageUrl: string
    ) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }

}
