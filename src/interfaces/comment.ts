export interface IComment {
  id: string
  user_comments:{
    name : string,
    email : string
  }
  comment: string
  votes: number
  voteGiven:boolean
  profile: string
  replies: IComment[]
}


