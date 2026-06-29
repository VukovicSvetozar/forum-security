export class TopicInfoResponse {

    id: number;
    name: string;
    imageUrl: string;
    active: boolean;

    constructor(
        id: number,
        name: string,
        imageUrl: string,
        active: boolean
    ) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.active = active;
    }

}