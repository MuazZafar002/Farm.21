import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native'
import {LeftArrow} from '../../../assets/iconWrappers/LeftArrow'
import {useAppSelector} from '../../redux/hooks'
import {useNavigation} from '@react-navigation/native'

interface IHeaderWithBackProps {
  title: string
  rightComponent?: React.JSX.Element
  rightComponentStyle?: StyleProp<ViewStyle>
  showBack?: boolean
}

export const HeaderWithBack = ({
  title,
  rightComponent,
  rightComponentStyle,
  showBack = true,
}: IHeaderWithBackProps) => {
  const theme = useAppSelector(state => state.theme)
  const navigation = useNavigation()
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {showBack ? (
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.left]}
          hitSlop={{left: 8, right: 8, bottom: 8, top: 8}}>
          <LeftArrow width={30} height={30} />
        </Pressable>
      ) : (
        <View style={styles.left}></View>
      )}
      <View style={[styles.middle]}>
        <Text
          style={[styles.title, {color: theme.appearance.primaryTextColor}]}>
          {title}
        </Text>
      </View>
      <View style={[rightComponentStyle, styles.right]}>
        {rightComponent ?? null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  left: {
    width: 64,
    justifyContent: 'center',
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
  },
  right: {
    width: 64,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
})
