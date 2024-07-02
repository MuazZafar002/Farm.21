import React, {useState,useEffect} from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import tw from 'twrnc'
import {Loading} from '../../Component'
import {KeyUtils} from '../../constants/Utils/KeyUtils'
import {DataUtils} from '../../constants/Utils/DataUtils'
import {useAppDispatch} from '../../redux/hooks'
import {LoginUser, getUser} from '../../core/backend'
import {ILoginProps, ILoginResponse} from '../../interfaces/user'
import {setUser, setUserCommunities} from '../../redux/reducers/user.slice'
import {UiUtils} from '../../constants/Utils/UiUtils'
import {setTheme} from '../../redux/reducers/theme.slice'
import {useLazyGetUserCommunityQuery} from '../../redux/rtk/farm21Backend'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'

WebBrowser.maybeCompleteAuthSession();
const Login = ({navigation}: any) => {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const dispatch = useAppDispatch()
  const [getUserCommunity] = useLazyGetUserCommunityQuery()
  const [accessToken,setAccessToken]=useState<any>(null);
  const [user,setUsers]=useState(null);
  const [request,response,promptAsync] = Google.useIdTokenAuthRequest({
    clientId:'717389434073-34b1ulv77psjl3fmp85afg72hr3rdq9p.apps.googleusercontent.com',
    androidClientId: '717389434073-60vvuj41aroreo8ndgtpremdqu4ohdg3.apps.googleusercontent.com'
  });

  useEffect(()=>{
    if(response?.type === 'success'){
      setAccessToken(response.authentication?.accessToken);
      if (accessToken){
        UiUtils.showToast(accessToken);
      }
      accessToken && fetchUserInfo();
    }
  },[response,accessToken])
  
  async function fetchUserInfo(){
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me",{
      headers:{ Authorization : `Bearer ${accessToken}`}
    });
    const userInfo=await response.json();
    UiUtils.showToast(userInfo);
    console.log(userInfo);
    setUsers(userInfo);
  }
  const validateEmail = (email: any) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    return emailPattern.test(email)
  }

  const handleLogin = () => {
    if (!validateEmail(username)) {
      setEmailError('Invalid email address')
      return
    }

    setLoading(true)
    const LoginData: ILoginProps = {
      email: username,
      password: password,
    }
    LoginUser(LoginData)
      .then(async (response: ILoginResponse | boolean) => {
        if (typeof response !== 'boolean') {
          await DataUtils.setData(
            KeyUtils.keys.bearerToken,
            response.data.token
          )
          const token = response.data.token
          const themeFromStorage = (await DataUtils.getData(
            KeyUtils.keys.theme
          )) as 'light' | 'dark' | 'system' | null
          const {
            data: userCommunity,
            isError,
            error,
          } = await getUserCommunity(undefined)
          if (themeFromStorage) {
            dispatch(
              setTheme({
                mode: themeFromStorage,
              })
            )
          }
          const userInstance = await getUser(token)
          if (userInstance) {
            dispatch(setUser(userInstance))
            if(isError){
              UiUtils.showToast("Could not load user's communities")
              console.error(error)
            }else{
              if(userCommunity?.communities){
                const joinedCommunities = userCommunity?.communities.map(community => community.id)
                dispatch(setUserCommunities(joinedCommunities))
              }
            }
            navigation.navigate(KeyUtils.screens.DrawerNavigator)
          } else {
            throw 'API failed'
          }
        } else {
          UiUtils.showToast('Invalid credentials')
          return
        }
      })
      .catch(error => {
        UiUtils.showToast('Internal server error. Please try again later')
        Alert.alert('Error', JSON.stringify(error))
      })
      .finally(() => setLoading(false))
  }

  const handleSignUp = () => {
    navigation.navigate(KeyUtils.screens.SignUp)
  }

  

  if (loading) {
    return <Loading message="Logging in" />
  }

  return (
    <ImageBackground
      source={require('../../../assets/background-image-login.jpeg')}
      style={tw.style('flex-1 items-center justify-center')}>
      <View style={tw.style('flex-1')}>
        <View style={tw.style('mt-20', 'items-center')}>
          <Image
            source={require('../../../assets/logo.png')}
            style={tw.style('w-80', 'h-40')}
          />
        </View>

        <View style={tw.style('mt-4', 'items-center')}>
          <View>
            <Icon
              name="user"
              size={30}
              color="white"
              style={tw.style('absolute', 'left-2', 'top-2')}
            />
            <TextInput
              style={tw.style(
                'w-70',
                'py-2',
                'pl-10',
                'rounded-md border',
                'border-white',
                'focus:outline-none',
                'text-white'
              )}
              placeholder="Email"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="white"
            />
          </View>
          <Text style={tw.style('text-red-600')}>{emailError}</Text>
        </View>

        <View style={tw.style('mt-4', 'items-center')}>
          <View>
            <Icon
              name="lock"
              size={30}
              color="white"
              style={tw.style('absolute', 'left-2', 'top-2')}
            />
            <TextInput
              style={tw.style(
                'w-70',
                'py-2',
                'pl-10',
                'rounded-md border',
                'border-white',
                'text-white'
              )}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="white"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={tw.style('absolute right-2 top-2')}
              onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? 'eye' : 'eye-slash'}
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={tw.style('mt-6', 'items-center', 'justify-center')}>
          <TouchableOpacity
            style={tw.style(
              'mt-4',
              'items-center',
              'bg-green-600',
              'rounded-full',
              'py-1.5',
              'w-32'
            )}
            onPress={handleLogin}>
            <Text style={tw.style('text-black', 'text-lg')}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={tw.style('mt-15 items-center')}>
          <Text>
            <Text style={tw.style('text-white')}>Don't have an account?</Text>{' '}
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={tw.style('text-blue-600 underline')}>Sign up</Text>
            </TouchableOpacity>
          </Text>
        </View>

        <View style={tw.style('items-center')}>
          <View>
            <TouchableOpacity
            onPress={()=>{
              promptAsync();
            }}
              style={tw.style(
                'mt-15',
                'items-center',
                'flex-row',
                'justify-center',
                'w-60',
                'border',
                'border-white',
                'rounded-md',
                'p-2'
              )}>
              <Icon
                name="google"
                size={30}
                color="green"
                style={tw.style('mr-2')}
              />
              <Text style={tw.style('text-white')}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}

export default Login
