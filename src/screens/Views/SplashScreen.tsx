import {useNavigation} from '@react-navigation/native'
import React, {useEffect} from 'react'
import {View, ImageBackground, Image} from 'react-native'
import {DataUtils} from '../../constants/Utils/DataUtils'
import {KeyUtils} from '../../constants/Utils/KeyUtils'
import {getUser} from '../../core/backend'
import {setUser, setUserCommunities} from '../../redux/reducers/user.slice'
import {GuidedTourUtils} from '../../constants/Utils/GuidedTourUtils'
import {useAppDispatch} from '../../redux/hooks'
import { UiUtils } from '../../constants/Utils/UiUtils'
import { setTheme } from '../../redux/reducers/theme.slice'
import { useLazyGetUserCommunityQuery } from '../../redux/rtk/farm21Backend'

interface ISplashScreenProps {
  // Define props here
}

export const SplashScreen: React.FC<ISplashScreenProps> = () => {
  const dispatch = useAppDispatch()
  const navigation = useNavigation()
  const [getUserCommunity] = useLazyGetUserCommunityQuery()
  

  const init = async () => {
    const token = await DataUtils.getData(KeyUtils.keys.bearerToken)
    const themeFromStorage = await DataUtils.getData(KeyUtils.keys.theme) as 'light' | 'dark' | 'system' | null
    if (token) {
      const userInstance = await getUser(token)
      const {data : userCommunity , isError , error} = await getUserCommunity(undefined)
      if (userInstance) {
        dispatch(setUser(userInstance))
        if(themeFromStorage){
          dispatch(setTheme({
            mode: themeFromStorage
          }))
        }
        if(isError){
          console.error(error)
          UiUtils.showToast("Could not load user's communities")
        }else{
          if(userCommunity?.communities){
            const joinedCommunities = userCommunity?.communities.map(community => community.id)
            dispatch(setUserCommunities(joinedCommunities))
          }
        }
      } else {
        UiUtils.showToast('Internal server error. Please try again later')
        navigation.reset({
          index : 0,
          routes : [
            // @ts-ignore
            {name : KeyUtils.screens.Login}
          ]
        })
        return
      }
      navigation.reset({
        index: 0,
        routes: [
          //@ts-ignore
          {name: KeyUtils.screens.DrawerNavigator},
        ],
      })
    } else {
      const userDetails = await DataUtils.getUserEmailAndUsername(
        KeyUtils.keys.user
      )
      const isVerified = await GuidedTourUtils.isVerificationCompleted()
      // if (userDetails) {
        if (userDetails && !isVerified) {
          navigation.reset({
            index: 0,
            routes: [
              //@ts-ignore
              {name: KeyUtils.screens.Verify},
            ],
          })
        } else {
          navigation.reset({
            index: 0,
            routes: [
              //@ts-ignore
              {name: KeyUtils.screens.Login},
            ],
          })
        }
      // }
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={require('../../../assets/background-image-login.jpeg')}
        resizeMode="cover"
        style={{
          flex: 1,
          width: '100%',
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image source={require('../../../assets/logo.png')} />
        </View>
      </ImageBackground>
    </View>
  )
}
