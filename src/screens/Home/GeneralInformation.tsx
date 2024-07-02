import React, {useState} from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native'
import tw from 'twrnc'
import {useAppSelector} from '../../redux/hooks'
import {SafeAreaView} from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome' // Import the vector icon library
import { UserIcon } from '../../../assets/iconWrappers/UserIcon'

export const GeneralInformation = ({navigation}: any) => {
  const theme = useAppSelector(state => state.theme)
  const user = useAppSelector(state => state.user.user)

  const [username, setUsername] = useState('JohnDoe')
  const [name, setName] = useState('John Doe')
  const [bio, setBio] = useState('This is my bio. I love coding!')

  const handleSaveChanges = () => {
    console.log('Changes saved!')
  }

  return (
    <SafeAreaView
      style={[tw`flex-1`, {backgroundColor: theme.appearance.cardBackground}]}>
      <View style={{marginTop: 40, marginLeft: 10, marginRight: 10}}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mb-4`}>
          <Icon
            name="arrow-left"
            size={24}
            color={theme.appearance.primaryTextColor}
          />
        </TouchableOpacity>

        {/* Profile Picture */}
        <View style={tw`items-center mt-6`}>
          {user?.profile && user?.profile !== '' ? (
            <Image 
              source={{uri: user?.profile}}
              style={{
                width: 100,
                height: 100,
                borderRadius: 999,
              }}
            />
          ) : (
            <UserIcon height={100} width={100}/>
          )}
        </View>
        {/* Input Fields */}
        <View style={tw`p-4`}>
          {/* Name Input Field */}
          <View>
            <Text
              style={[
                tw` mb-2`,
                {fontWeight: 'bold', color: theme.appearance.primaryTextColor},
              ]}>
              Name
            </Text>
            <View
              style={[
                tw`border-2 p-2 mb-4`,
                {
                  borderColor: theme.appearance.primaryTextColor,
                  backgroundColor: theme.appearance.messageBackground,
                },
              ]}>
              <Text style={[{color: theme.appearance.primaryTextColor}]}>
                {user?.name}
              </Text>
            </View>
          </View>

          {/* Bio Input Field */}
          <View>
            <Text
              style={[
                tw` mb-2`,
                {fontWeight: 'bold', color: theme.appearance.primaryTextColor},
              ]}>
              Bio
            </Text>
            <View
              style={[
                tw`border-2 p-2 mb-4`,
                {
                  borderColor: theme.appearance.primaryTextColor,
                  backgroundColor: theme.appearance.messageBackground,
                },
              ]}>
              <Text
                style={[{color: theme.appearance.primaryTextColor}]} // Adjust height for the bio input
              >
                {user?.desc}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
