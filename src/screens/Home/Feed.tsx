import {FlatList, Modal, Pressable, Text, TextInput, View} from 'react-native'
import React, {useState, useEffect, useRef, useCallback} from 'react'
import {Loading} from '../../Component'
import {UiUtils} from '../../constants/Utils/UiUtils'
import {useAppSelector} from '../../redux/hooks'
import {
  useGetFeedQuery,
  useLazyGetPostByIdQuery,
} from '../../redux/rtk/farm21Backend'
import {IPost} from '../../interfaces/post'
import {Post} from '../../Component/Post/Post'
import {EmptyState} from '../../../assets/iconWrappers/EmptyState'
import {Button} from '../../Component/common/Button'
import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {KeyUtils} from '../../constants/Utils/KeyUtils'
import BottomSheet from '@gorhom/bottom-sheet'
import {UserBottomSheet} from '../../Component/common/UserBottomSheet'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
  createSocketConnection,
  disconnectFromSocket,
  sendMessageToUser,
} from '../../core/socket'
import {TestimonialModal} from '../../Component/modal/TestimonialModal'

const Feed = () => {
  const [refreshing, setRefreshing] = useState(false)

  const theme = useAppSelector(state => state.theme)

  const {data, isError, refetch, isLoading: isLoadingPosts} = useGetFeedQuery()
  const [getPostById] = useLazyGetPostByIdQuery()
  const [feedPosts, setFeedPosts] = useState<IPost[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [messageModalVisible, setMessageModalVisible] = useState<boolean>(false)
  const [testimonialModalVisible, setTestimonialModalVisible] =
    useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [userToSendTestimonial, setUserToSendTestimonial] = useState<
    string | null
  >(null)
  const bottomSheetRef = useRef<BottomSheet>(null)

  const navigation = useNavigation()

  const fetchPostDetails = async (id: string) => {
    const {
      data: postData,
      error: postError,
      isError,
    } = await getPostById(id, true)
    if (isError) {
      console.error(postError)
      throw postError
    } else {
      if (postData) {
        const postExist = feedPosts.some(post => post.id === postData?.id)
        if (!postExist) setFeedPosts(prev => [...prev, postData])
      }
    }
  }

  const handleMessageSend = () => {
    if (userId) {
      sendMessageToUser(message, userId)
      setMessage('')
      setMessageModalVisible(false)
    }
  }

  useEffect(() => {
    createSocketConnection()
    return disconnectFromSocket
  }, [])

  useFocusEffect(
    useCallback(() => {
      refetch()
    } , [])
  )

  useEffect(() => {
    if (data?.length) {
      setIsLoading(true)
      const promises = data.map(async post => {
        await fetchPostDetails(post.id)
      })
      Promise.all(promises)
        .then(() => {
          setIsLoading(false)
        })
        .catch(error => {
          console.error(error)
          setIsLoading(false)
        })
    } else {
      setFeedPosts([])
    }
  }, [data])

  if (isLoading || isLoadingPosts) {
    return <Loading />
  }
  if (isError) {
    UiUtils.showToast('Error in fetching posts')
  }
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.appearance.background,
        }}>
        {feedPosts.length > 0 ? (
          <FlatList
            data={feedPosts}
            renderItem={item => (
              <Post
                key={item.index}
                post={item.item}
                isFeed={true}
                bottomSheetRef={bottomSheetRef}
                setUserId={setUserId}
              />
            )}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              refetch().then(() => setRefreshing(false))
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <EmptyState height={300} />
            <Text
              style={{
                color: theme.appearance.primaryTextColor,
                fontSize: 20,
                fontWeight: '400',
                marginBottom: 10,
              }}>
              Join communities to see their posts
            </Text>
            <Button
              text="See communities"
              onClick={() => {
                //@ts-ignore
                navigation.jumpTo(KeyUtils.screens.Community, {
                  isFromFeed: true,
                })
              }}
              buttonStyle={{
                width: '75%',
              }}
              labelStyle={{
                textAlign: 'center',
              }}
            />
          </View>
        )}
        <UserBottomSheet
          refBottomSheet={bottomSheetRef}
          id={userId}
          setModalVisible={setMessageModalVisible}
          setTestimonialModal={setTestimonialModalVisible}
          setUserName={setUserToSendTestimonial}
        />
      </View>
      <Modal transparent={true} visible={messageModalVisible}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              width: '100%',
              minHeight: 40,
              backgroundColor: theme.appearance.buttonBackground,
            }}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
              }}>
              <TextInput
                style={{
                  width: '80%',
                  color: theme.appearance.buttonText,
                }}
                placeholder="Type your message here..."
                placeholderTextColor={theme.appearance.buttonText}
                value={message}
                onChangeText={text => setMessage(text)}
                multiline={true}
              />
              <Pressable
                onPress={handleMessageSend}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesome
                  name="send"
                  size={24}
                  color={theme.appearance.buttonText}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <TestimonialModal
        isVisible={testimonialModalVisible}
        name={userToSendTestimonial}
        userId={userId}
        setModalIsVisible={setTestimonialModalVisible}
      />
    </>
  )
}

export default Feed
