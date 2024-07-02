import {View, Text, Image} from 'react-native'
import React from 'react'
import tailwind from 'twrnc'
import { useAppSelector } from '../../redux/hooks'

export default function CommunityInfo({
  img
}: any) {
  const theme= useAppSelector(state => state.theme)
  return (
    <View style={tailwind.style(`flex-row items-center gap-2 mb-3`)}>
      <Image source={img} style={tailwind.style(`w-8 h-8 rounded-full`)} />
      <Text style={tailwind.style(`text-xs text-[${theme.appearance.primaryTextColor}]`)}>Farm 21</Text>
    </View>
  )
}
