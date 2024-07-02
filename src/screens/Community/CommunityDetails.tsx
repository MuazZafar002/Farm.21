import React, {useEffect, useMemo, useState} from 'react'
import {View, Text, Image, FlatList} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useAppDispatch, useAppSelector} from '../../redux/hooks'
import {
  useLazyGetCommunityDetailsQuery,
  useLazyGetCommunityPostsQuery,
  useLazyGetPostByIdQuery,
} from '../../redux/rtk/farm21Backend'
import {ICommunityDetails} from '../../interfaces/community'
import {UiUtils} from '../../constants/Utils/UiUtils'
import {useNavigation} from '@react-navigation/native'
import {UserIcon} from '../../../assets/iconWrappers/UserIcon'
import {Loading} from '../../Component'
import {Button} from '../../Component/common/Button'
import {HeaderWithBackAndSearch} from '../../Component/common/HeaderWithBackAndSearch'
import {IPost} from '../../interfaces/post'
import {joinCommunity} from '../../core/backend'
import {Post} from '../../Component/Post/Post'
import {EmptyState} from '../../../assets/iconWrappers/EmptyState'
import { appendCommunity } from '../../redux/reducers/user.slice'

interface ICommunityDetailsProps {
  route: any
}

export const CommunityDetails = ({route}: ICommunityDetailsProps) => {
  const theme = useAppSelector(state => state.theme)
  const joinedCommunities = useAppSelector(state => state.user.joinedCommunities)
  const navigation = useNavigation()
  const {id} = route?.params
  const [communityDetails] = useLazyGetCommunityDetailsQuery()
  const [communityPosts] = useLazyGetCommunityPostsQuery()
  const [postById] = useLazyGetPostByIdQuery()
  const dispatch = useAppDispatch()
  const [details, setDetails] = useState<ICommunityDetails | undefined>(
    undefined
  )
  const [posts, setPosts] = useState<IPost[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchText, setSeachText] = useState<string>('')
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false)

  useEffect(() => {
    const getCommunityDetails = async () => {
      if (id) {
        const {data, error, isError} = await communityDetails(id)
        if (isError) {
          console.error(error)
          UiUtils.showToast('An error occurred')
          throw error
        } else {
          setDetails(data)
        }
      } else {
        UiUtils.showToast('Id not found')
        throw 'Id not found'
      }
    }
    const getCommunityPosts = async () => {
      if (id) {
        const {data, error, isError} = await communityPosts(id)
        if (isError) {
          console.error(error)
          UiUtils.showToast('An error occurred')
          throw error
        } else {
          data?.community_posts?.forEach(async post => {
            const {
              data: postsData,
              error: postError,
              isError: isPostError,
            } = await postById(post.id, true)
            if (isPostError) {
              console.error(postError)
              UiUtils.showToast('An error occurred')
            } else {
              if (postsData) {
                const postExists = posts.find(post => post.id === postsData?.id)
                if (!postExists) {
                  setPosts([...posts, postsData])
                }
              }
            }
          })
        }
      } else {
        UiUtils.showToast('Id not found')
        throw 'Id not found'
      }
    }
    Promise.all([getCommunityDetails(), getCommunityPosts()])
      .then()
      .catch(() => {
        navigation.goBack()
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleJoinCommunityButton = async () => {
    setIsLoading(true)
    const hasJoined = await joinCommunity(id)
    if (hasJoined) {
      UiUtils.showToast('Community Joined')
      dispatch(appendCommunity(id))
    } else {
      UiUtils.showToast('Error in joining community. Please try again later')
    }
    setIsLoading(false)
  }
  if (isLoading) {
    return <Loading />
  }

  const hasJoined = joinedCommunities?.some(community => community === id)
  

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.appearance.background,
      }}>
      <HeaderWithBackAndSearch
        isSearchFocused={isSearchFocused}
        setSearchText={setSeachText}
        setIsSearchFocused={setIsSearchFocused}
        searchText={searchText}
        placeholder="Search in Community"
      />
      <View
        style={{
          width: '100%',
          backgroundColor: theme.appearance.cardBackground,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {details?.profile ? (
            <Image
              source={{uri: details?.profile}}
              style={{
                width: 100,
                height: 100,
                borderRadius : 999
              }}
            />
          ) : (
            <UserIcon />
          )}
          <Text
            style={{
              color: theme.appearance.primaryTextColor,
              fontSize: 24,
              fontWeight: '700',
              marginLeft: 10,
              textAlign: 'center',
              marginTop: 30,
            }}>
            {details?.name}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              width: '60%',
            }}>
            <Text
              style={{
                color: theme.appearance.bodyColor,
                marginTop: 10,
              }}>
              {details?.desc}
            </Text>
          </View>
            <View>
              <Button
                text={!hasJoined ? 'Subscribe' : 'Joined'}
                onClick={handleJoinCommunityButton}
                buttonStyle={{
                  width: 125,
                  height: 40,
                }}
                disabled={hasJoined}
              />
            </View>
        </View>
      </View>
      {!isLoading && posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={({item}) => <Post post={item} key={item.id} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <EmptyState />
        </View>
      )}
    </SafeAreaView>
  )
}
