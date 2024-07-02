import React from 'react'
import ProfileCard from './profile-screen/ProfileCard'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import {KeyUtils} from '../../constants/Utils/KeyUtils'
import UserPosts from './profile-screen/UserPosts'
import {createStackNavigator} from '@react-navigation/stack'
import AddDescription from './profile-screen/AddDescription'
import { useAppSelector } from '../../redux/hooks'
import { UserTestimonials } from './profile-screen/UserTestimonials'


const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator()

const UserProfileScreen = ({
  navigation
}: any) => {

  const theme = useAppSelector(state => state.theme)
  return (
    <>
      
      <ProfileCard navigation={navigation} />
      <Tab.Navigator 
      initialRouteName={KeyUtils.screens.UserPosts}
      screenOptions={{
        tabBarStyle : {
          backgroundColor : theme.appearance.background
        },
        tabBarLabelStyle : {
          color : theme.appearance.primaryTextColor,
        },
        tabBarIndicatorStyle: {
          backgroundColor : theme.appearance.primaryTextColor
        },
        tabBarActiveTintColor : theme.appearance.activeTabColor
        
      }}
      >
        <Tab.Screen
          name={KeyUtils.screens.UserPosts}
          component={UserPosts}
          options={{
            title: 'Posts',
          }}
        />
        <Tab.Screen 
          name={KeyUtils.screens.UserTestimonials}
          component={UserTestimonials}
          options={{
            title: 'Testimonials'
          }}
        />
        {/* <Tab.Screen name={KeyUtils.screens.UserComments} component={UserComments}
          options={{
            title: 'Comm8ents'
          }}
        /> */}
      </Tab.Navigator>
    </>
  )
}

const UserProfile = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={KeyUtils.screens.ProfileScreen}>
      <Stack.Screen
        component={UserProfileScreen}
        name={KeyUtils.screens.ProfileScreen}
      />
      <Stack.Screen
        component={AddDescription}
        name={KeyUtils.screens.AddDescription}
      />
    </Stack.Navigator>
  )
}

export default UserProfile
