import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LeftArrow } from '../../../assets/iconWrappers/LeftArrow';
import { HeaderSearchText } from './HeaderSearchText';

interface IHeaderWithBackAndSearchProps {
    isSearchFocused: boolean
    setSearchText: React.Dispatch<React.SetStateAction<string>>
    setIsSearchFocused: React.Dispatch<React.SetStateAction<boolean>>
    searchText: string,
    placeholder: string
}

export const HeaderWithBackAndSearch = ({
    isSearchFocused,
    setSearchText,
    setIsSearchFocused,
    searchText,
    placeholder
} : IHeaderWithBackAndSearchProps) => {
    const navigation = useNavigation()
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical : 10
        }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.left]}
          hitSlop={{left: 8, right: 8, bottom: 8, top: 8}}>
          <LeftArrow width={30} height={30} />
        </Pressable>
        <View style={[styles.middle]}>
          <HeaderSearchText 
            isSearchFocused={isSearchFocused}
            setSearchText={setSearchText}
            setIsSearchFocused={setIsSearchFocused}
            searchText={searchText}
            placeholder={placeholder}
          />
        </View>
      </View>
    )
};

const styles = StyleSheet.create({
    left: {
      width: 64,
      justifyContent : 'center',
    },
    middle: {
      flex: 1,
    },
    right: {
      width: 64,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      marginTop : 5
    },
  })
