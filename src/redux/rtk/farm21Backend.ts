import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/dist/query/react'
import {DataUtils} from '../../constants/Utils/DataUtils'
import {KeyUtils} from '../../constants/Utils/KeyUtils'
import {
  ICommunity,
  ICommunityDetails,
  ICommunityPosts,
  IUserCommunity,
} from '../../interfaces/community'
import {IPost, IPostApiResponse} from '../../interfaces/post'
import {IUser} from '../../interfaces/user'
import { ITestimonial } from '../../interfaces/testimonial'

export const farm21BackendApi = createApi({
  reducerPath: 'farm21BackendApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://farm-21-api.onrender.com/',
    prepareHeaders: async headers => {
      const token = await DataUtils.getData(KeyUtils.keys.bearerToken)
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: builder => ({
    getCommunity: builder.query<ICommunity, void>({
      query: () => 'api/community',
    }),
    getCommunityDetails: builder.query<ICommunityDetails, string>({
      query: (id: string) => `api/community/${id}`,
    }),
    getCommunityPosts: builder.query<ICommunityPosts, string>({
      query: (id: string) => `api/community/post/${id}`,
    }),
    getPostById: builder.query<IPost, string>({
      query: (id: string) => `api/post/${id}`,
    }),
    getFeed: builder.query<IPostApiResponse[], void>({
      query: () => 'api/feed',
      transformResponse: (response: IPostApiResponse[]) => {
        return response
      },
    }),
    getUserPosts: builder.query<IPostApiResponse[], void>({
      query: () => 'api/post',
      transformResponse: (response: IPostApiResponse[]) => {
        return response
      },
    }),
    getUserCommunity: builder.query<IUserCommunity, undefined>({
      query: () => 'api/user/community',
      transformResponse: (response: IUserCommunity) => {
        return response
      },
    }),
    getAnotherUserPosts: builder.query<IPostApiResponse[], string>({
      query: (id: string) => `api/post/user/${id}`,
      transformResponse: (response: IPostApiResponse[]) => {
        return response
      },
    }),
    getUserById: builder.query<IUser, string>({
      query: (id: string) => `api/user/${id}`,
      transformResponse: (response: IUser) => {
        return response
      },
    }),
    getTestimonial: builder.query<ITestimonial[] , undefined>({
      query : () => 'api/testamonial',
      transformResponse: (response : ITestimonial[]) => {
        return response
      }
    })
  }),
})

export const {
  useGetCommunityQuery,
  useLazyGetCommunityQuery,
  useLazyGetUserCommunityQuery,
  useGetFeedQuery,
  useGetUserPostsQuery,
  useLazyGetFeedQuery,
  useLazyGetCommunityDetailsQuery,
  useLazyGetCommunityPostsQuery,
  useLazyGetPostByIdQuery,
  useLazyGetAnotherUserPostsQuery,
  useLazyGetUserByIdQuery,
  useGetTestimonialQuery
} = farm21BackendApi
