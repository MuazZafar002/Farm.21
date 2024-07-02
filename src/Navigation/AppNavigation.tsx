import {NavigationContainer} from '@react-navigation/native'
import {Login, Signup} from '../screens'
import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import {DrawerNavigator} from './DrawerNavigation'
import {Ionicons} from '@expo/vector-icons'
import {KeyUtils} from '../constants/Utils/KeyUtils'
import tailwind from 'twrnc'
import {Entypo} from '@expo/vector-icons'
import {useAppSelector} from '../redux/hooks'
import {Verify} from '../screens/Auth/Verify'
import {PasswordAndSecurity} from '../screens/Home/PasswordAndSecurity'

import {SplashScreen} from '../screens/Views/SplashScreen'
import {CreateCommunity} from '../screens/Community/CreateCommunity'
import {CommunityDetails} from '../screens/Community/CommunityDetails'
import {ShowPost} from '../screens/Home/ShowPost'
import {AppearanceScreen} from '../screens/AppearanceScreen'
import {Settings} from '../screens/Home/Settings'
import {GeneralInformation} from '../screens/Home/GeneralInformation'

const Stack = createStackNavigator()
const AppNavigation = () => {
  const theme = useAppSelector(state => state.theme)

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={KeyUtils.screens.Splash}
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.appearance.headingBackground,
          },
        }}>
        <Stack.Screen name={KeyUtils.screens.Splash} component={SplashScreen} />
        <Stack.Screen
          name={KeyUtils.screens.DrawerNavigator}
          component={DrawerNavigator}
        />
        <Stack.Screen name={KeyUtils.screens.SignUp} component={Signup} />
        <Stack.Screen name={KeyUtils.screens.Verify} component={Verify} />
        <Stack.Screen name={KeyUtils.screens.Login} component={Login} />
        <Stack.Screen name={KeyUtils.screens.Settings} component={Settings} />
        <Stack.Screen
          name={KeyUtils.screens.CreateCommunity}
          component={CreateCommunity}
        />
        <Stack.Screen
          name={KeyUtils.screens.CommunityDetails}
          component={CommunityDetails}
        />
        <Stack.Screen
          name={KeyUtils.screens.PasswordAndSecurity}
          component={PasswordAndSecurity}
        />
        <Stack.Screen
          name={KeyUtils.screens.GeneralInformation}
          component={GeneralInformation}
        />
        <Stack.Screen
          name={KeyUtils.screens.ShowPost}
          //@ts-ignore
          component={ShowPost}
        />
        <Stack.Screen
          name={KeyUtils.screens.Appearance}
          component={AppearanceScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation
