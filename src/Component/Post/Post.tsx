import {View, Modal, Text, Pressable} from 'react-native'
import React, {MutableRefObject, useState} from 'react'
import ImageViewer from 'react-native-image-zoom-viewer'
import {useAppSelector} from '../../redux/hooks'
import {IPost} from '../../interfaces/post'
import {UserIcon} from '../../../assets/iconWrappers/UserIcon'
import {PostInfo} from './PostInfo'
import {TouchableRipple} from 'react-native-paper'
import {useNavigation} from '@react-navigation/native'
import {KeyUtils} from '../../constants/Utils/KeyUtils'
import {Image} from 'expo-image'
import {likePost} from '../../core/backend'
import {UiUtils} from '../../constants/Utils/UiUtils'
import BottomSheet from '@gorhom/bottom-sheet'

export const Post = ({
  post,
  isFeed,
  bottomSheetRef,
  setUserId,
  isBottomSheet = false,
}: {
  post: IPost | undefined
  isFeed?: boolean
  bottomSheetRef?: MutableRefObject<BottomSheet | null>
  setUserId?: React.Dispatch<React.SetStateAction<string>>
  isBottomSheet?: boolean
}) => {
  const [imageIndex, setImageIndex] = useState(0)
  const [viewImage, setViewImage] = useState(false)
  const [isPostLiked, setIsPostLiked] = useState<boolean>(
    post?.isLiked ?? false
  )
  const [likeCount, setLikeCount] = useState<number>(post?.likes ?? 0)
  const [postState, setPostState] = useState<IPost>(post as IPost)
  const theme = useAppSelector(state => state.theme)
  const navigation = useNavigation()
  const {user} = useAppSelector(state => state.user)

  const onNamePress = () => {
    if (bottomSheetRef) {
      bottomSheetRef.current?.snapToIndex(0)
    }
    setUserId?.(post?.user_posts?.id ?? '')
  }

  const onPressLike = async () => {
    setIsPostLiked(true)
    setLikeCount(prev => prev + 1)
    setPostState(prev => {
      return {
        ...prev,
        likes: prev.likes + 1,
        isLiked: true,
      }
    })
    try {
      if (post?.id) {
        await likePost(post.id)
        UiUtils.showToast('Post liked')
      }
    } catch (error) {
      console.error(error)
      UiUtils.showToast('Error occurred in liking post')
      setIsPostLiked(false)
    }
  }

  const handleCommunityNamePress = () => {
    //@ts-ignore
    navigation.navigate(KeyUtils.screens.CommunityDetails, {
      id: post?.community_posts?.id,
    } as any)
  }

  return (
    <TouchableRipple
      style={{
        backgroundColor: theme.appearance.background,
        marginVertical: 5,
        paddingVertical: 10,
      }}
      rippleColor="rgba(0, 0, 0, 0.32)"
      onPress={() => {
        if (!isBottomSheet) {
          //@ts-ignore
          navigation.navigate(KeyUtils.screens.ShowPost, {
            post: postState,
          })
        }
      }}>
      <>
        <View
          style={{
            width: '100%',
            backgroundColor: theme.appearance.cardBackground,
            paddingLeft: 20,
          }}>
          <View style={[{flexDirection: 'row', gap: 10}]}>
            {post?.community_posts?.profile ? (
              <Image
                source={{uri: post?.community_posts?.profile}}
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 999,
                }}
              />
            ) : (
              <View
                style={{
                  paddingTop: 35,
                  paddingRight: 15,
                }}>
                <UserIcon width={24} height={24} />
              </View>
            )}
            <View style={{flexDirection: 'column'}}>
              <Pressable onPress={handleCommunityNamePress}>
                <Text
                  style={[
                    {
                      color: theme.appearance.primaryTextColor,
                      fontSize: 20,
                      fontWeight: '700',
                      marginTop: 35,
                    },
                  ]}>
                  {post?.community_posts?.name}
                </Text>
              </Pressable>
              <Pressable
                onPress={onNamePress}
                disabled={isBottomSheet || post?.user_posts?.id === user.id}
                hitSlop={{bottom: 4, top: 4, left: 8, right: 8}}>
                <Text
                  style={[
                    {
                      color: theme.appearance.bodyColor,
                      fontSize: 14,
                      marginTop: 10,
                    },
                  ]}>
                  {post?.user_posts?.name}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <Text
          style={[
            {
              color: theme.appearance.primaryTextColor,
              fontSize: 24,
              fontWeight: '700',
              marginVertical: 10,
            },
          ]}>
          {post?.title}
        </Text>
        {!isFeed && (
          <Text
            style={[
              {color: theme.appearance.primaryTextColor, marginVertical: 20},
            ]}>
            {post?.content}
          </Text>
        )}
        {post?.attachments && post.attachments.length > 0 ? (
          <Pressable onPress={() => setViewImage(prevView => !prevView)}>
            <Image
              source={{uri: post.attachments[0]}}
              style={{
                width: '100%',
                height: 200,
                marginVertical: 10,
              }}
              cachePolicy={'memory-disk'}
            />
          </Pressable>
        ) : null}
        <PostInfo
          commentCount={post?.comments}
          likeCount={likeCount}
          isPostLiked={isPostLiked}
          onPressLike={onPressLike}
        />
        <Modal
          visible={viewImage}
          transparent={true}
          onRequestClose={() => setViewImage(prevView => !prevView)}>
          <ImageViewer
            imageUrls={post?.attachments?.map(attachment => ({
              url: attachment,
            }))}
            index={imageIndex}
            onCancel={() => setViewImage(prevView => !prevView)}
            enableSwipeDown
          />
        </Modal>
      </>
    </TouchableRipple>
  )
}
