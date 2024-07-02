import {IPostApiResponse} from './post'

export interface CommunityModerator {
  name: string
  email: string
}

export interface ICommunityDetails {
  id: string
  name: string
  desc: string
  createdAt: string
  communityModerator: CommunityModerator
  profile?: string
}

export interface ICommunity {
  community: ICommunityDetails[] | undefined
}

export interface ICommunityPosts extends ICommunityDetails {
  community_posts: IPostApiResponse[]
}

export interface IUserCommunity {
  communities: [
    {
      id: string
    },
  ]
}

export interface ICreateCommunityResponse {
  id: string
}
