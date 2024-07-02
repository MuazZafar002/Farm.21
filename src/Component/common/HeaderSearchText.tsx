import React, { useRef } from 'react';
import { View, TextInput, Pressable, StyleProp, ViewStyle } from 'react-native';
import { useAppSelector } from '../../redux/hooks';
import { SearchIcon } from '../../../assets/iconWrappers/SearchIcon';
import { CrossIcon } from '../../../assets/iconWrappers/CrossIcon';

interface IHeaderSearchTextProps {
    isSearchFocused: boolean
    setSearchText: React.Dispatch<React.SetStateAction<string>>
    setIsSearchFocused: React.Dispatch<React.SetStateAction<boolean>>
    searchText: string,
    placeholder: string
    containerStyle? : StyleProp<ViewStyle>
}

export const HeaderSearchText = ({
    isSearchFocused,
    setSearchText,
    setIsSearchFocused,
    searchText,
    placeholder,
    containerStyle
} : IHeaderSearchTextProps) => {
    const theme = useAppSelector(state => state.theme)
    const inputRef = useRef<TextInput>(null)
    return (
      <View
        style={[{
          width: '100%',
        } , containerStyle]}>
        <View
          style={{
            flexDirection: 'row',
            borderColor: theme.appearance.primaryTextColor,
            borderRadius: 40,
            gap: 10,
            borderWidth: 1,
            padding: 10,
          }}>
          <SearchIcon />
          <TextInput
            ref={inputRef}
            value={searchText}
            onFocus={() => setIsSearchFocused(true)}
            onChangeText={text => setSearchText(text)}
            placeholder={placeholder}
            placeholderTextColor={theme.appearance.primaryTextColor}
            style={{
              color: theme.appearance.primaryTextColor,
              flex: 1,
            }}
          />
          {isSearchFocused ? (
            <Pressable
              onPress={() => {
                setSearchText('')
                setIsSearchFocused(false)
                if (inputRef.current) {
                  inputRef.current?.blur()
                }
              }}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 2,
              }}>
              <CrossIcon />
            </Pressable>
          ) : null}
        </View>
      </View>
    )
};
