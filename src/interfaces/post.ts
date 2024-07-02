export interface IPostApiResponse {
    id : string
}

export interface IPost {
    id : string,
    title : string,
    content : string,
    community_posts : {
        id : string,
        name : string,
        description : string,
        profile : string,
    },
    user_posts : {
        id : string,
        name : string,
        profile : string,
    },
    likes : number,
    comments : number,
    attachments : string[],
    isLiked : boolean
}