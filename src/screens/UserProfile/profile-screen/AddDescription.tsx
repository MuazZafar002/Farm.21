import React, {useEffect, useState} from 'react'
import {View, Text, TextInput, TouchableOpacity} from 'react-native'

import {Entypo} from '@expo/vector-icons'
import {MaterialIcons} from '@expo/vector-icons'
import tailwind from 'twrnc'
import {Loading} from '../../../Component'
import {useDispatch, useSelector} from 'react-redux'
import {useAppSelector} from '../../../redux/hooks'
import {DataUtils} from '../../../constants/Utils/DataUtils'
import {KeyUtils} from '../../../constants/Utils/KeyUtils'
import {setUserDescription} from '../../../core/backend'
import {updateUserDescription} from '../../../redux/reducers/user.slice'
import {SafeAreaView} from 'react-native-safe-area-context'
import {UiUtils} from '../../../constants/Utils/UiUtils'

export default function AddDescription({navigation}: any) {
  const [showLoading, setShowLoading] = useState(false)
  const user = useAppSelector(state => state.user.user)
  const [description, setDescription] = useState(!user?.desc ? '' : user?.desc)
  const dispatch = useDispatch()
  const theme = useAppSelector(state => state.theme)
  let token: string

  DataUtils.getData(KeyUtils.keys.bearerToken).then(response => {
    if (response) {
      token = response
    }
  })

  const handleAccept = () => {
    //checking if description is empty then returning back
    if (description === '') {
      UiUtils.showToast('Description is empty')
      navigation.goBack()
      return
    }
    setShowLoading(true)
    setUserDescription(token, description).then(response => {
      if (response) {
        dispatch(updateUserDescription(description))
      } else {
        console.error('API failed')
      }
    })
    .catch(error => console.error(error))
    .finally(() => {
      setShowLoading(false)
      navigation.goBack()
    })
  }

  const handleRejection = () => {
    navigation.goBack()
  }

  if (showLoading) {
    return <Loading />
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.appearance.background,
      }}>
      <View
        style={tailwind.style(
          `border-b border-[${theme.appearance.primaryTextColor}] mt-10`
        )}>
        <TextInput
          placeholderTextColor={theme.appearance.primaryTextColor}
          placeholder={!user?.desc ? 'Enter description' : ''}
          style={tailwind.style(`text-[${theme.appearance.primaryTextColor}]`)}
          multiline={true}
          value={description}
          onChangeText={text => setDescription(text)}
        />
      </View>
      <View
        style={tailwind.style(
          `justify-center items-center p-4 bg-[${theme.appearance.background}] flex flex-row justify-around m-10`
        )}>
        <TouchableOpacity onPress={handleAccept}>
          <Entypo
            name="check"
            size={30}
            color={theme.appearance.primaryTextColor}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRejection}>
          <MaterialIcons
            name="cancel"
            size={30}
            color={theme.appearance.primaryTextColor}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
