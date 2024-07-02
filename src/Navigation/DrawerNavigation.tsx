import React from 'react'
import {
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer'
import HomeTopTab from './HomeTopTab'
import {Text, View, Image} from 'react-native'
import {Button} from '../Component/common/Button'
import {useAppSelector} from '../redux/hooks'
import {KeyUtils} from '../constants/Utils/KeyUtils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {UserIcon} from '../../assets/iconWrappers/UserIcon'
import { Entypo } from '@expo/vector-icons';

const Drawer = createDrawerNavigator()

const DrawerContent = ({navigation}: {navigation: any}) => {
  const theme = useAppSelector(state => state.theme)
  const user = useAppSelector(state => state.user.user)
  return (
    <DrawerContentScrollView
      style={{backgroundColor: theme.appearance.cardBackground}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 2,
          borderBottomColor: theme.appearance.border,
          marginBottom: 25,
        }}>
          <View
            style={{
              flexDirection : 'row',
            }}
          >
            {user?.profile && user?.profile !== '' ? (
              <Image
                source={{uri: user?.profile}}
                style={{width: 100, height: 100, borderRadius: 999}}
              />
            ) : (
              <UserIcon width={100} height={100}/>
            )}
            {user?.isExpert ? (
              <Entypo name="star" size={32} color="#FFDF00" style={{
              
                position : 'absolute',
                bottom : 0,
                right : 0,
              }}/>
            ) : null}
          </View>
        <Text
          style={{
            color: theme.appearance.primaryTextColor,
            fontWeight: '700',
            fontSize: 24,
            marginBottom: 10,
          }}>
          {user?.name}
        </Text>
      </View>

      <View>
        {/* <Button
          text="Settings"
          onClick={() => navigation.navigate(KeyUtils.screens.Settings)}
        /> */}
        <Button
          text="Theme"
          onClick={() => navigation.navigate(KeyUtils.screens.Appearance)}
        />
        <Button
          text={'Logout'}
          onClick={() => {
            AsyncStorage.clear().then(() => {
              navigation.reset({
                index: 0,
                routes: [{name: KeyUtils.screens.Login}],
              })
            })
          }}
        />
      </View>
    </DrawerContentScrollView>
  )
}

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={({navigation}) => (
        <DrawerContent navigation={navigation} />
      )}>
      <Drawer.Screen
        component={HomeTopTab}
        name={KeyUtils.screens.HomeTopTabs}
      />
    </Drawer.Navigator>
  )
}
