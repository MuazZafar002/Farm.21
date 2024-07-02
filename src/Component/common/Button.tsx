import React from 'react'
import {
  View,
  Text,
  Image,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TextStyle,
} from 'react-native'
import {useAppSelector} from '../../redux/hooks'

export const Button: React.FC<{
  text: string
  onClick: () => void
  icon?: any
  buttonStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  disabled?: boolean
}> = ({text, onClick, icon, buttonStyle, labelStyle, disabled}) => {
  const theme = useAppSelector(state => state.theme)
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={[
        {
          backgroundColor: theme.appearance.buttonBackground,
          borderRadius: 10,
          marginHorizontal: 10,
          marginVertical: 5,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        },
        buttonStyle,
      ]}>
      <View>
        {icon ? (
          <Image
            source={icon}
            style={{
              width: 10,
              height: 10,
            }}
          />
        ) : null}

        <Text
          style={[
            labelStyle,
            {
              color: theme.appearance.buttonText,
            },
          ]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
