import {Chats, Message} from '../screens'
import {createStackNavigator} from '@react-navigation/stack'
import { useAppSelector } from '../redux/hooks'
import { KeyUtils } from '../constants/Utils/KeyUtils'

const Stack = createStackNavigator()

export default function MessagingStack() {
  const theme = useAppSelector(state => state.theme)
  return (
    <Stack.Navigator
      initialRouteName={KeyUtils.screens.Chats}
      screenOptions={{
        headerShown : false,
      }}
      >
      <Stack.Screen name={KeyUtils.screens.Chats} component={Chats} />
      <Stack.Screen name={KeyUtils.screens.Messages} component={Message} />
    </Stack.Navigator>
  )
}
