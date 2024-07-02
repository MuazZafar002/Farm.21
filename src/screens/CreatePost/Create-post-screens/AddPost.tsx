import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native'
import React, {Fragment, useContext} from 'react'
import tailwind from 'twrnc'
import {PostContext} from '../../../constants/context/PostContext'
import {useAppSelector} from '../../../redux/hooks'
import {SafeAreaView} from 'react-native-safe-area-context'
import {HeaderWithBack} from '../../../Component/common/HeaderWithBack'
import {Button} from '../../../Component/common/Button'
import {UiUtils} from '../../../constants/Utils/UiUtils'
import {KeyUtils} from '../../../constants/Utils/KeyUtils'
import {useNavigation} from '@react-navigation/native'
export default function AddPost() {
  const {title, body, setBody, setTitle} = useContext(PostContext)
  const theme = useAppSelector(state => state.theme)
  const navigation = useNavigation()

  const HeaderComponent = () => {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: theme.appearance.background,
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: theme.appearance.border,
        }}>
        <View
          style={{
            width: 100,
          }}></View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: theme.appearance.primaryTextColor,
              fontSize: 20,
              fontWeight: '800',
            }}>
            Add post details
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Button
            text="Post"
            onClick={() => {
              if (title === '' || body === '') {
                UiUtils.showToast('Kindly enter both title and body.')
              } else {
                //@ts-ignore
                navigation.navigate(KeyUtils.screens.SearchCommunity)
              }
            }}
            buttonStyle={{
              width: 80,
              height: 40,
            }}
          />
        </View>
      </View>
    )
  }
  return (
    <Fragment>
      <HeaderComponent />
      <SafeAreaView
        style={{flex: 1, backgroundColor: theme.appearance.background}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TextInput
            placeholder="Title"
            placeholderTextColor={theme.appearance.primaryTextColor}
            value={title}
            onChangeText={text => setTitle(text)}
            style={tailwind.style(
              `w-full border-[${theme.appearance.primaryTextColor}] border-2 pl-4 h-10 rounded-xl mb-5 mt-5 text-left text-[${theme.appearance.primaryTextColor}]`
            )}
            maxLength={60}></TextInput>
          <TextInput
            placeholder="Body"
            placeholderTextColor={theme.appearance.primaryTextColor}
            value={body}
            onChangeText={text => setBody(text)}
            style={tailwind.style(
              `w-full border-[${theme.appearance.primaryTextColor}] border-2 pl-4 h-20 rounded-xl mb-5 mt-5 text-left text-[${theme.appearance.primaryTextColor}]`
            )}
            multiline={true}
            numberOfLines={20}></TextInput>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Fragment>
  )
}
