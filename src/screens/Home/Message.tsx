import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, {useEffect, useRef} from 'react'
import {HeaderWithBack} from '../../Component/common/HeaderWithBack'
import {IUser} from '../../interfaces/user'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useAppSelector} from '../../redux/hooks'
import {IMessage} from '../../interfaces/socket'
import moment from 'moment'
import {
  disconnectFromSocket,
  listenToEvent,
  removeEvent,
  sendAckToServer,
  sendMessageToUser,
} from '../../core/socket'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {UiUtils} from '../../constants/Utils/UiUtils'

export default function Message({route}: {route: any}) {
  const user: IUser = route?.params?.user
  const [messages, setMessages] = React.useState<IMessage[]>(
    route?.params?.messages ?? []
  )
  const [message, setMessage] = React.useState<string>('')
  const theme = useAppSelector(state => state.theme)
  const userFromSlice = useAppSelector(state => state.user.user)

  const flatListRef = useRef<FlatList>(null)

  
  useEffect(() => {
    messages.forEach(message => {
      if (message.id) {
        sendAckToServer(message.id)
      }
    })
    listenToEvent('message', (response: IMessage) => {
      if (response) {
        console.log(response.message)
        const doesExist = messages.some(message => message.createdAt === response.createdAt)
        if (!doesExist){
          setMessages(prev => [...prev, response])
          if (response.id) {
            sendAckToServer(response.id)
          }
        }
      }
    })

    return () => {
      removeEvent("message")
      disconnectFromSocket()
    }
  }, [])

  

  const sendMessage = () => {
    if (message !== '') {
      sendMessageToUser(message, user?.id)
      const messageToAppend: IMessage = {
        message: message,
        sender: userFromSlice?.id,
        createdAt: moment().valueOf().toString(),
        received: false,
        receiver: user?.id,
      }
      setMessages(prev => [...prev, messageToAppend])
      setMessage('')
    } else {
      UiUtils.showToast('Message cannot be empty')
    }
  }
  
  const renderItem = ({item}: {item: IMessage}) => {
    const pictureUri =
      item.sender === userFromSlice?.id ? userFromSlice.profile : user?.profile
    const senderName =
      item.sender === userFromSlice?.id ? userFromSlice.name : user?.name
    const timeStamp = parseInt(item.createdAt, 10)
    return (
      <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
          paddingVertical: 5,
        }}>
        <View
          style={{
            backgroundColor: theme.appearance.messageBackground,
          }}>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
            }}>
            <Image
              source={{
                uri: pictureUri == '' ? userFromSlice.profile : pictureUri,
              }}
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                marginTop: 2,
                marginLeft: 2,
              }}
            />
            <Text
              style={{
                color: theme.appearance.primaryTextColor,
              }}>
              {senderName}
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: theme.appearance.primaryTextColor,
                marginLeft: 10,
                marginTop: 5,
              }}>
              {item.message}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              marginRight: 10,
            }}>
            <Text
              style={{
                color: theme.appearance.primaryTextColor,
              }}>
              {moment(timeStamp).format('YY-MM-DD HH:mm:ss')}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.appearance.background,
      }}>
      <HeaderWithBack title={user?.name} />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.createdAt}
        style={{
          flex: 1,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}>
        <View
          style={{
            backgroundColor: theme.appearance.sendMessageBox,
            padding: 10,
            justifyContent: 'space-between',
            flexDirection: 'row',
            margin: 5,
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <TextInput
              placeholder="Type your message here..."
              placeholderTextColor={theme.appearance.primaryTextColor}
              value={message}
              onChangeText={text => setMessage(text)}
              multiline={true}
              style={{
                color: theme.appearance.primaryTextColor,
              }}
            />
          </View>
          <Pressable
            hitSlop={{bottom: 4, top: 4, left: 4, right: 4}}
            onPress={sendMessage}>
            <FontAwesome
              name="send"
              size={24}
              color={theme.appearance.primaryTextColor}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
