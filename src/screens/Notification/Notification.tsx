import {View, Text} from 'react-native'

import React from 'react'
import { useAppSelector } from '../../redux/hooks'


const Notification = () => {
  const theme = useAppSelector(state => state.theme)
  return (
    <View>
      <Text style={{color: theme.appearance.primaryTextColor}}>Notification</Text>
    </View>
  )
}

export default Notification
