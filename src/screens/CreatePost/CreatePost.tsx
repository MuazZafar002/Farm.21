import {Text, Pressable, Alert} from 'react-native'
import React, {useState} from 'react'
import tailwind from 'twrnc'
import {createStackNavigator} from '@react-navigation/stack'
import AddPost from './Create-post-screens/AddPost'
import SearchCommunity from './Create-post-screens/SearchCommunity'
import AddImage from './Create-post-screens/AddImage'
import {PostContext} from '../../constants/context/PostContext'
import {CommunityContext} from '../../constants/context/CommunityContext'
import {KeyUtils} from '../../constants/Utils/KeyUtils'
import {Entypo} from '@expo/vector-icons'
import {useAppSelector} from '../../redux/hooks'
import {Button} from '../../Component/common/Button'
import {UiUtils} from '../../constants/Utils/UiUtils'
const Stack = createStackNavigator()

const CreatePost = ({navigation}: any) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [name, setName] = useState('')
  const [imageUri, setImageUri] = useState('')
  const [subscribers, setSubscribers] = useState(0)
  const theme = useAppSelector(state => state.theme)
  const [communityId , setCommunityId] = useState('')
  return (
    <CommunityContext.Provider
      value={{
        name,
        setName,
        subscribers,
        setSubscribers,
        imageUri,
        setImageUri,
        communityId,
        setCommunityId
      }}>
      <PostContext.Provider value={{title, body, setTitle, setBody}}>
        <Stack.Navigator
          initialRouteName={KeyUtils.screens.AddPost}
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.appearance.background,
            },
            headerTitleStyle: {
              color: theme.appearance.primaryTextColor,
            },
            headerBackImage: () => (
              <Entypo
                name="chevron-left"
                size={24}
                color={theme.appearance.primaryTextColor}
              />
            ),
            headerBackTitleVisible: false,
          }}>
          <Stack.Screen
            name={KeyUtils.screens.AddPost}
            component={AddPost}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name={KeyUtils.screens.SearchCommunity}
            component={SearchCommunity}
            options={({navigation}) => ({
              title: '',
              headerShown: false,
            })}
          />
          <Stack.Screen
            name={KeyUtils.screens.AddImage}
            component={AddImage}
            options={() => ({
              title: '',
              headerShown: false,
            })}
          />
        </Stack.Navigator>
      </PostContext.Provider>
    </CommunityContext.Provider>
  )
}
export default CreatePost
