import {View, Text} from 'react-native'
import React from 'react'
import {useAppSelector} from '../../redux/hooks'
import * as Progress from 'react-native-progress'

interface ILoading {
  message?: string
}

export default function Loading({message}: ILoading) {
  const theme = useAppSelector(state => state.theme)
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.appearance.background,
        paddingHorizontal: 50,
      }}>
      {message ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.appearance.headingBackground,
            gap: 10,
            alignItems: 'center',
            padding: 10,
          }}>
          <View
            style={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: theme.appearance.primaryTextColor,
              }}>
              {message}
            </Text>
          </View>
          <Progress.Circle
            indeterminate={true}
            color={theme.appearance.primaryTextColor}
            size={40}
            endAngle={0.7}
          />
        </View>
      ) : (
        <View>
          <Progress.Circle
            indeterminate={true}
            color={theme.appearance.primaryTextColor}
            size={40}
            endAngle={0.7}
          />
        </View>
      )}
    </View>
  )
}
