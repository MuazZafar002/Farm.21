import {SafeAreaView} from 'react-native-safe-area-context'
import {HeaderWithBack} from '../Component/common/HeaderWithBack'
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group'
import {useAppDispatch, useAppSelector} from '../redux/hooks'
import {useEffect, useMemo, useState} from 'react'
import {DataUtils} from '../constants/Utils/DataUtils'
import {KeyUtils} from '../constants/Utils/KeyUtils'
import {setTheme} from '../redux/reducers/theme.slice'
import {View} from 'react-native'

export const AppearanceScreen = () => {
  const [selectedButton, setSelectedButton] = useState<string | undefined>(
    'dark'
  )
  const theme = useAppSelector(state => state.theme)
  const dispatch = useAppDispatch()

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: 'dark',
        label: 'Dark',

        onPress: () => handleThemeChange('dark'),
        labelStyle: {
          color: theme.appearance.primaryTextColor,
        },
        color: '#0000FF',
      },
      {
        id: 'light',
        label: 'Light',

        onPress: () => handleThemeChange('light'),
        labelStyle: {
          color: theme.appearance.primaryTextColor,
        },
        color: '#0000FF',
      }
    ],
    [theme]
  )

  useEffect(() => {
    const loadThemeFromStorage = async () => {
      const theme = await DataUtils.getData(KeyUtils.keys.theme)
      if (theme) {
        setSelectedButton(theme)
      }
    }
    loadThemeFromStorage()
  }, [])

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    await DataUtils.setData(KeyUtils.keys.theme , theme)
    dispatch(
      setTheme({
        mode: theme,
      })
    )
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.appearance.background,
      }}>
      <HeaderWithBack title="Appearance" />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 25,
        }}>
        <RadioGroup
          radioButtons={radioButtons}
          selectedId={selectedButton}
          onPress={setSelectedButton}
          containerStyle={{
            width: '100%',
          }}
        />
      </View>
    </SafeAreaView>
  )
}
