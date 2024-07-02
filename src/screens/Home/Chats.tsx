import {View, Text, Image, TouchableOpacity} from 'react-native'
import {useAppSelector} from '../../redux/hooks'
import {useCallback, useEffect, useState} from 'react'
import {
  disconnectFromSocket,
  emitEventWithouData,
  listenToEvent,
  removeEvent,
} from '../../core/socket'
import {IAllMessagesResponse} from '../../interfaces/socket'
import {IUser} from '../../interfaces/user'
import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {useLazyGetUserByIdQuery} from '../../redux/rtk/farm21Backend'
import {SafeAreaView} from 'react-native-safe-area-context'
import {FlatList} from 'react-native-gesture-handler'
import {Loading} from '../../Component'
import {KeyUtils} from '../../constants/Utils/KeyUtils'
import {HeaderWithBack} from '../../Component/common/HeaderWithBack'

export default function Chats() {
  const theme = useAppSelector(state => state.theme)
  const {user} = useAppSelector(state => state.user)
  const [users, setUsers] = useState<IUser[]>([])
  const [userMessages, setUserMessages] = useState<IAllMessagesResponse | null>(
    null
  )
  const [getUserById] = useLazyGetUserByIdQuery()
  const [loading, setLoading] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const navigation = useNavigation()

  useFocusEffect(
    useCallback(() => {
      emitEventWithouData('all messages')
    }, [])
  )

  useEffect(() => {
    const getUsers = async () => {
      if (userMessages) {
        setLoading(true)
        for (const [key, value] of Object.entries(userMessages)) {
          const {data, error, isError} = await getUserById(key, true)
          if (isError) {
            console.error(error)
          } else {
            if (data) {
              const doesExist = users.some(user => user.id === data.id)
              if (!doesExist) {
                setUsers(prev => [...prev, data])
              }
            }
          }
        }
        setLoading(false)
      }
    }

    getUsers()
  }, [userMessages])

  useEffect(() => {
    listenToEvent('all messages', (response: IAllMessagesResponse) => {
      if (response) {
        setUserMessages(response)
      }
    })

    return () => {
      removeEvent('all messages')
      disconnectFromSocket()
    }
  }, [])

  if (loading) {
    return <Loading />
  }

  const renderItem = ({item}: {item: IUser}) => {
    const messagesOfUser = userMessages ? userMessages[item.id] : []
    const isLastMessageOfCurrentUser: boolean =
      messagesOfUser?.[messagesOfUser.length - 1]?.sender === user.id
    return (
      <TouchableOpacity
        onPress={() => {
          //@ts-ignore
          navigation.navigate(KeyUtils.screens.Messages, {
            user: item,
            messages: messagesOfUser,
          })
        }}
        key={item.id}
        style={{
          width: '100%',
          padding: 10,
          backgroundColor: theme.appearance.cardBackground,
          borderRadius: 10,
          marginVertical: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
          }}>
          <Image
            source={{uri: item.profile}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 999,
            }}
          />
          <View
            style={{
              flexDirection: 'column',
            }}>
            <Text
              style={{
                color: theme.appearance.primaryTextColor,
                fontWeight: isLastMessageOfCurrentUser
                  ? 'normal'
                  : messagesOfUser?.[messagesOfUser.length - 1]?.received
                    ? 'normal'
                    : '500',
                fontSize: 18,
              }}>
              {item.name}
            </Text>
            <Text
              style={{
                color: isLastMessageOfCurrentUser
                  ? theme.appearance.bodyColor
                  : messagesOfUser?.[messagesOfUser.length - 1]?.received
                    ? theme.appearance.bodyColor
                    : theme.appearance.primaryTextColor,
                marginTop: 5,
              }}>
              {messagesOfUser?.[messagesOfUser.length - 1]?.message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.appearance.background,
      }}>
      <HeaderWithBack title="Chats" />
      {users.length === 0 ? (
        <View
          style={{
            flex : 1,
            justifyContent : 'center',
            alignItems : 'center',
            backgroundColor: theme.appearance.background,
          }}
        >
          <Text
            style={{
              color : theme.appearance.primaryTextColor,
              fontWeight : '600',
              fontSize : 18,
              textAlign : 'center',
            }}
          >
            You don't have any chats yet
          </Text>
          <Text
            style={{
              color : theme.appearance.primaryTextColor,
              fontWeight : '300',
              fontSize : 14,
              textAlign : 'center',
            }}
          >
            On feed press on user name to open bottom sheet and start chat
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
            emitEventWithouData('all messages')
            setRefreshing(false)
          }}
        />

      )}
    </SafeAreaView>
  )
}
