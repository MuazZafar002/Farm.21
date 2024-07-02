import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {CreatePost, UserProfile, Feed} from '../screens'
import {Community} from '../screens/Community/Community'
import {MarketplaceNavigator} from '../screens/Marketplace/MarketplaceNavigator'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import IconFoundation from 'react-native-vector-icons/Foundation'
import Feather from 'react-native-vector-icons/Feather'
import Ionicon from 'react-native-vector-icons/Ionicons'
import {KeyUtils} from '../constants/Utils/KeyUtils'
import {useAppSelector} from '../redux/hooks'

const Tab = createBottomTabNavigator()

const HomeNav = ({navigation}: {navigation: any}) => {
  const theme = useAppSelector(state => state.theme)
  return (
    <Tab.Navigator
      initialRouteName={KeyUtils.screens.Feed}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.appearance.activeTabColor,
        tabBarInactiveTintColor: theme.appearance.inActiveTabColor,
        tabBarActiveBackgroundColor: theme.appearance.activeTabColor,
        headerPressOpacity: 0.5,
        headerLeft: () => (
          <Feather
            name="menu"
            style={{
              color: theme.appearance.primaryTextColor,
              fontSize: 35,
              backgroundColor: theme.appearance.headingBackground,
            }}
            onPress={() => navigation.openDrawer()}
          />
        ),
        tabBarStyle: {
          backgroundColor: theme.appearance.headingBackground,
        },
        headerTitle: '',
        headerStyle: {
          backgroundColor: theme.appearance.headingBackground,
        },
      }}>
      <Tab.Screen
        name={KeyUtils.screens.Feed}
        component={Feed}
        options={({navigation}: {navigation: any}) => ({
          headerRight: () => (
            <Ionicon
              name="chatbox-ellipses"
              style={{
                color: theme.appearance.primaryTextColor,
                fontSize: 35,
                backgroundColor: theme.appearance.headingBackground,
              }}
              onPress={() => navigation.navigate('Chats')}
            />
          ),
          tabBarIcon: () => {
            return (
              <IconFoundation
                name="home"
                size={25}
                color={theme.appearance.primaryTextColor}
              />
            )
          },
        })}
      />
      <Tab.Screen
        name={KeyUtils.screens.MarketPlaceNavigator}
        component={MarketplaceNavigator}
        options={{
          tabBarIcon: () => {
            return (
              <IconFontAwesome
                name="briefcase"
                size={20}
                color={theme.appearance.primaryTextColor}
              />
            )
          },
        }}
      />
      <Tab.Screen
        name={KeyUtils.screens.CreatePost}
        component={CreatePost}
        options={{
          tabBarIcon: () => {
            return (
              <IconFontAwesome
                name="plus-square-o"
                size={25}
                color={theme.appearance.primaryTextColor}
              />
            )
          },
        }}
      />

      <Tab.Screen
        name={KeyUtils.screens.Community}
        component={Community}
        options={{
          headerShown: false,
          tabBarIcon: () => {
            return (
              <Ionicon
                name="people"
                size={25}
                color={theme.appearance.primaryTextColor}
              />
            )
          },
        }}
      />

      <Tab.Screen
        name={KeyUtils.screens.User}
        component={UserProfile}
        options={{
          tabBarIcon: () => {
            return (
              <IconFontAwesome
                name="user-circle-o"
                size={20}
                color={theme.appearance.primaryTextColor}
              />
            )
          },
        }}
      />
    </Tab.Navigator>
  )
}

export default HomeNav
