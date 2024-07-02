import {Modal, Pressable, ScrollView, TextInput, View} from 'react-native'
import {Comments} from '../../Component'
import {useAppSelector} from '../../redux/hooks'
import {Post} from '../../Component/Post/Post'
import {IPost} from '../../interfaces/post'
import {useRef, useState} from 'react'
import BottomSheet from '@gorhom/bottom-sheet'
import {UserBottomSheet} from '../../Component/common/UserBottomSheet'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {sendMessageToUser} from '../../core/socket'
import {TestimonialModal} from '../../Component/modal/TestimonialModal'
import {HeaderWithBack} from '../../Component/common/HeaderWithBack'
import {SafeAreaView} from 'react-native-safe-area-context'

export const ShowPost = ({route}: {route: any}) => {
  const theme = useAppSelector(state => state.theme)
  const post: IPost = route?.params?.post
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [message, setMessage] = useState<string>('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [testimonialModalVisible, setTestimonialModalVisible] =
    useState<boolean>(false)
  const [userToSendTestimonial, setUserToSendTestimonial] = useState<
    string | null
  >(null)

  const handleMessageSend = () => {
    if (post?.user_posts?.id) {
      sendMessageToUser(message, post.user_posts.id)
      setMessage('')
      setModalVisible(false)
    }
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.appearance.cardBackground,
        flex : 1
      }}>
      <HeaderWithBack title="Post info" />
      <ScrollView
        style={{
          backgroundColor : theme.appearance.background
        }}
      >
        <Post post={post} isFeed={false} bottomSheetRef={bottomSheetRef} />
        <Comments id={post.id} />
      </ScrollView>
      <UserBottomSheet
        refBottomSheet={bottomSheetRef}
        id={post?.user_posts?.id}
        setModalVisible={setModalVisible}
        setTestimonialModal={setTestimonialModalVisible}
        setUserName={setUserToSendTestimonial}
      />
      <Modal transparent={true} visible={modalVisible}>
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
        userId={post?.user_posts?.id}
        setModalIsVisible={setTestimonialModalVisible}
      />
    </SafeAreaView>
  )
}
