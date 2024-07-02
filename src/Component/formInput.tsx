import React from 'react'
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useAppSelector } from '../redux/hooks'

const FormInput = (props: any) => {
  const theme = useAppSelector(state => state.theme)
  let borderColor = ''
  if (
    (props.validEmail == false && props.formKey === 'email') ||
    (props.validPassword == false && props.formKey === 'password') ||
    props.validity == false
  ) {
    borderColor = `border-[${theme.appearance.heartReact}]`
  } else {
    borderColor = `border-[${theme.appearance.primaryTextColor}]`
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View
        style={tw.style(
          'rounded p-2 border text-white flex-row mb-3 ' + borderColor
        )}>
        <Ionicons name={props.iconName} size={32} color={'white'} />
        <TextInput
          placeholder={props.placeholder}
          style={tw.style('ml-2 w-50 text-white')}
          onChange={event =>
            props.handleFormValueChange(props.formKey, event.nativeEvent.text)
          }
          placeholderTextColor={'white'}
          {...props.textInputProps}
        />
        {props.formKey === 'password' && (
          <Pressable onPress={props.togglePasswordVisibility}>
            <Ionicons
              name={props.passwordVisibility ? 'eye-off' : 'eye'}
              size={32}
              color={'white'}></Ionicons>
          </Pressable>
        )}
      </View>
      {props.validPassword == false && (
        <Text style={tw.style('text-sm text-red-700 mb-3')}>
          Invalid password
        </Text>
      )}
      {props.formKey === 'password' && (
        <Text style={tw.style('text-white mb-5')}>
          Password must contain{'\n'}
          {'\u2022 Must be between 4 - 20 characters \n'}
          {`\u2022 At least one Capital letter \n`}
          {`\u2022 At least one Small letter \n`}
          {`\u2022 At least one number \n`}
        </Text>
      )}
      {props.validEmail == false && (
        <Text style={tw.style('text-sm text-red-700 mb-3')}>Invalid email</Text>
      )}
      {props.validity == false && (
        <Text style={tw.style('text-sm text-red-600 mb-3')}>
          {props.placeholder} cannot be empty
        </Text>
      )}
    </KeyboardAvoidingView>
  )
}

export default FormInput
