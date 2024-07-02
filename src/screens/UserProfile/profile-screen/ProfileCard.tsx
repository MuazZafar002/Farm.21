import {View, Text, Image, TouchableHighlight,TouchableOpacity, Alert} from 'react-native'
import { useState } from 'react'
import tailwind from 'twrnc'
import {MaterialIcons} from '@expo/vector-icons'
import {FontAwesome5} from '@expo/vector-icons'
import {AntDesign} from '@expo/vector-icons'
import {EvilIcons} from '@expo/vector-icons'
import {colors} from '../../../constants'
import moment from 'moment'
import {useAppSelector} from '../../../redux/hooks'
import {UserIcon} from '../../../../assets/iconWrappers/UserIcon'
import ProfileModal from './profileModal'
import { Entypo } from '@expo/vector-icons';

export const memberSince = (apiTime: string) => {
  // Parse the API time using Moment.js
  const apiMoment = moment(apiTime)

  // Calculate the difference between API time and current time
  const diff = moment.duration(moment().diff(apiMoment))

  // Get years, months, and days from the difference
  const years = diff.years()
  const months = diff.months()
  const days = diff.days()

  // Construct the elapsed time string
  let elapsedTime = ''
  if (years > 0) {
    elapsedTime += `${years} ${years === 1 ? 'year' : 'years'}`
  }
  if (months > 0) {
    elapsedTime += ` ${months} ${months === 1 ? 'month' : 'months'}`
  }
  if (days > 0) {
    elapsedTime += ` ${days} ${days === 1 ? 'day' : 'days'}`
  } else {
    elapsedTime += '0 days'
  }

  return elapsedTime.trim() // Trim any leading/trailing whitespace
}
export default function ProfileCard({navigation, route}: any) {
  const iconSize = 12
  const theme = useAppSelector(state => state.theme)
  const user = useAppSelector(state => state.user.user)
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  if (user) {
    return (
      <View
      style={[{
        paddingHorizontal : 10,
        paddingVertical : 20,
        gap : 2,
        borderBottomWidth : 1,
        borderBottomColor : theme.appearance.border,
        backgroundColor : theme.appearance.headingBackground
      }]}
        >
        <View style={tailwind.style('flex flex-row items-center gap-3')}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={{minWidth : 13 ,minHeight : 13}}>
          {user?.profile ? (
            <Image
              source={{ uri: user?.profile }}
              resizeMode="cover"
              style={tailwind.style('w-13 h-13 rounded-full')}
            />
          ) : (
            <UserIcon width={50} height={50} />
          )}
          {user?.isExpert ? (
              <Entypo name="star" size={16} color="#FFDF00" style={{
              
                position : 'absolute',
                bottom : 0,
                right : 0,
              }}/>
            ) : null}
          </TouchableOpacity>
          <Text style={tailwind.style(`text-[${theme.appearance.primaryTextColor}] text-lg font-bold`)}>
            {user?.name}
          </Text>
        </View>

        <TouchableHighlight
          underlayColor={colors.darkGreen}
          onPress={() => navigation.navigate('AddDescription')}>
          <View style={tailwind.style('flex flex-row justify-between')}>
            <Text style={tailwind.style('text-zinc-400 italic mt-2 mb-2')}>
              {user?.desc && user.desc != ''
                ? user.desc
                : 'Add a description...'}
            </Text>
            <EvilIcons
              name="pencil"
              size={30}
              color={theme.appearance.primaryTextColor}
            />
          </View>
        </TouchableHighlight>

        <View style={tailwind.style('flex flex-row gap-4')}>
          <Text
            style={tailwind.style(
              `text-[${theme.appearance.primaryTextColor}] text-sm`
            )}>
            <MaterialIcons
              name="military-tech"
              size={iconSize}
              color={theme.appearance.primaryTextColor}
            />{' '}
            {user?.rank}
          </Text>
          <Text
            style={tailwind.style(
              `text-[${theme.appearance.primaryTextColor}] text-sm`
            )}>
            <FontAwesome5
              name="coins"
              size={iconSize}
              color={theme.appearance.primaryTextColor}
            />
            {'  ' + user?.coins}
          </Text>
          <Text
            style={tailwind.style(
              `text-[${theme.appearance.primaryTextColor}] text-sm`
            )}>
            <AntDesign
              name="clockcircleo"
              size={iconSize}
              color={theme.appearance.primaryTextColor}
            />
            {'  ' + memberSince(user?.createdAt)}
          </Text>

        <ProfileModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
        </View>
      </View>
    )
  } else {
    return null
  }
}
