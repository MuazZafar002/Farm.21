import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet'
import {useAppSelector} from '../../redux/hooks'
import {MutableRefObject, useEffect, useState} from 'react'
import {Image, Text, View} from 'react-native'
import {MaterialIcons} from '@expo/vector-icons'
import {FontAwesome5} from '@expo/vector-icons'
import {AntDesign} from '@expo/vector-icons'
import {memberSince} from '../../screens/UserProfile/profile-screen/ProfileCard'
import {Button} from './Button'
import {
  useLazyGetAnotherUserPostsQuery,
  useLazyGetPostByIdQuery,
  useLazyGetUserByIdQuery,
} from '../../redux/rtk/farm21Backend'
import Loading from './Loading'
import {IPost} from '../../interfaces/post'
import {Post} from '../Post/Post'
import {UiUtils} from '../../constants/Utils/UiUtils'
import {IUser} from '../../interfaces/user'
import { Entypo } from '@expo/vector-icons';

interface UserBottomSheetProps {
  refBottomSheet: MutableRefObject<BottomSheet | null>
  id: string
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  setTestimonialModal: React.Dispatch<React.SetStateAction<boolean>>
  setUserName: React.Dispatch<React.SetStateAction<string | null>>
}
export const UserBottomSheet = ({
  refBottomSheet,
  id,
  setModalVisible,
  setTestimonialModal,
  setUserName
}: UserBottomSheetProps) => {
  const theme = useAppSelector(state => state.theme)
  const [getPosts] = useLazyGetAnotherUserPostsQuery()
  const [getPostDetails] = useLazyGetPostByIdQuery()
  const [getUserById] = useLazyGetUserByIdQuery()
  const [userPosts, setUserPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    const getUserPosts = async () => {
      if (id) {
        setLoading(true)
        const {data, error, isError} = await getPosts(id)
        const {
          data: userDetails,
          error: userDetailsError,
          isError: userDetailsIsError,
        } = await getUserById(id)
        if (userDetailsIsError) {
          console.error(userDetailsError)
          UiUtils.showToast('Error in fetching user details')
          refBottomSheet?.current?.close()
          return
        }
        if (isError) {
          console.error(error)
          UiUtils.showToast('Error in fetching user posts')
          refBottomSheet?.current?.close()
          return
        }
        if (userDetails) {
          setUser(userDetails)
        }
        data?.forEach(async post => {
          const {
            data: postData,
            error: postError,
            isError,
          } = await getPostDetails(post.id)
          if (isError) {
            console.error(postError)
          } else {
            if (postData) {
              const postExist = userPosts.some(post => post.id === postData?.id)
              if (!postExist) {
                setUserPosts(prev => [...prev, postData])
              }
            }
          }
        })

        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    setUserPosts([])
    getUserPosts()
  }, [id])

  return (
    <BottomSheet
      backgroundStyle={{
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderTopEndRadius: 24,
        borderTopStartRadius: 24,
      }}
      snapPoints={['45%', '100%']}
      index={-1}
      enablePanDownToClose={true}
      ref={refBottomSheet}>
      {loading ? (
        <View
          style={{
            flex: 1,
            backgroundColor: theme.appearance.cardBackground,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Loading />
        </View>
      ) : (
        <>
          <View
            style={{
              width: '100%',
              paddingHorizontal: 10,
              backgroundColor: theme.appearance.cardBackground,
              borderBottomWidth: 2,
              borderBottomColor: theme.appearance.border,
            }}>
            <View style={{flexDirection: 'row', gap: 20}}>
              <View>
                <Image
                  source={{uri: user?.profile}}
                  resizeMode="cover"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 999,
                  }}
                />
                  {user?.isExpert ? (
                  <Entypo name="star" size={16} color="#FFDF00" style={{
                  
                    position : 'absolute',
                    bottom : 0,
                    right : 0,
                  }}/>
                ) : null}
              </View>
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text
                  style={{
                    color: theme.appearance.primaryTextColor,
                    fontWeight: '600',
                    fontSize: 18,
                    marginTop: 10,
                  }}>
                  {user?.name}
                </Text>
                <Text
                  style={{
                    color: theme.appearance.bodyColor,
                    fontSize: 12,
                    marginTop: 5,
                    fontStyle: 'italic',
                  }}>
                  {user?.desc ? user.desc : ''}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                width: '60%',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <MaterialIcons
                  name="military-tech"
                  size={24}
                  color={theme.appearance.primaryTextColor}
                />
                <Text
                  style={{
                    color: theme.appearance.primaryTextColor,
                    fontSize: 16,
                  }}>
                  {user?.rank}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <FontAwesome5
                  name="coins"
                  size={24}
                  color={theme.appearance.primaryTextColor}
                />
                <Text
                  style={{
                    color: theme.appearance.primaryTextColor,
                    fontSize: 16,
                    marginLeft: 5,
                  }}>
                  {user?.coins}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <AntDesign
                  name="clockcircleo"
                  size={24}
                  color={theme.appearance.primaryTextColor}
                />
                <Text
                  style={{
                    color: theme.appearance.primaryTextColor,
                    fontSize: 16,
                    marginLeft: 5,
                  }}>
                  {user?.createdAt ? memberSince(user.createdAt) : ''}
                </Text>
              </View>
            </View>
            <Button
              text="Message"
              onClick={() => {
                refBottomSheet?.current?.close()
                setModalVisible(true)
              }}
              buttonStyle={{marginTop: 20, width: '100%'}}
            />
            {user?.giveTestamonial ? (
              <Button
                text="Give testamonial"
                onClick={() => {
                  refBottomSheet?.current?.close()
                  setUserName(user?.name ? user.name : null)
                  setTestimonialModal(true)
                }}
                buttonStyle={{marginTop: 5, width: '100%'}}
              />
            ) : null}
          </View>
          <BottomSheetScrollView
            style={{
              backgroundColor: theme.appearance.cardBackground,
            }}>
            {userPosts.map(post => (
              <Post
                key={post.id}
                post={post}
                isFeed={true}
                isBottomSheet={true}
              />
            ))}
          </BottomSheetScrollView>
        </>
      )}
    </BottomSheet>
  )
}
