import {View, Text, Pressable} from 'react-native'
import React, {Fragment, useState} from 'react'
import {useAppSelector} from '../../redux/hooks'
import {SafeAreaView} from 'react-native-safe-area-context'
import {RightChevron} from '../../../assets/iconWrappers/RightChevron'
import {FireIcon} from '../../../assets/iconWrappers/FireIcon'
import Feather from 'react-native-vector-icons/Feather'
import {useNavigation} from '@react-navigation/native'
import {useGetCommunityQuery} from '../../redux/rtk/farm21Backend'
import {Loading} from '../../Component'
import {SearchCommunity} from './components/SearchCommunity'
import {KeyUtils} from '../../constants/Utils/KeyUtils'
import {HeaderSearchText} from '../../Component/common/HeaderSearchText'

export const Community = ({route} : any) => {
  const theme = useAppSelector(state => state.theme)
  const [searchText, setSeachText] = useState<string>('')
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(route?.params?.isFromFeed ?? false)
  const {data: communityData, isLoading , refetch} = useGetCommunityQuery()

  if (isLoading) {
    return <Loading message="Loading data" />
  }

  const navigation = useNavigation()
  return (
    <Fragment>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.appearance.background,
        }}>
        <Feather
          name="menu"
          style={{
            color: theme.appearance.primaryTextColor,
            fontSize: 35,
            marginLeft: 10,
          }}
          //@ts-ignore
          onPress={() => navigation.openDrawer()}
        />
        <HeaderSearchText
          isSearchFocused={isSearchFocused}
          setSearchText={setSeachText}
          setIsSearchFocused={setIsSearchFocused}
          searchText={searchText}
          placeholder="Search Community"
          containerStyle={{
            paddingHorizontal: 40,
            paddingVertical: 10,
          }}
        />
        {isSearchFocused ? (
          <SearchCommunity
            communityData={communityData?.community}
            searchText={searchText}
            refetch={refetch}
          />
        ) : (
          <Fragment>
            <CreateCommunityTile />
            <TopCommunityPost />
          </Fragment>
        )}
      </SafeAreaView>
    </Fragment>
  )
}

const CreateCommunityTile = () => {
  const theme = useAppSelector(state => state.theme)
  const navigation = useNavigation()

  return (
    <Pressable
      style={{
        backgroundColor: theme.appearance.cardBackground,
        flexDirection: 'row',
        marginHorizontal: 25,
        marginVertical: 20,
        padding: 20,
      }}
      //@ts-ignore
      onPress={() => navigation.navigate(KeyUtils.screens.CreateCommunity)}>
      <View
        style={{
          flex: 1,
        }}>
        <View>
          <Text
            style={{
              color: theme.appearance.primaryTextColor,
              fontWeight: '800',
              fontSize: 20,
              marginBottom: 3,
            }}>
            Create Community
          </Text>
        </View>
        <View>
          <Text
            style={{
              color: theme.appearance.primaryTextColor,
              fontWeight: '100',
              fontSize: 12,
            }}>
            Bring like-minded individuals together
          </Text>
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <RightChevron />
      </View>
    </Pressable>
  )
}

const TopCommunityPost = () => {
  const theme = useAppSelector(state => state.theme)

  return (
    <Fragment>
      <View
        style={{
          borderBottomColor: theme.appearance.primaryTextColor,
          borderBottomWidth: 1,
          paddingBottom: 10,
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: theme.appearance.primaryTextColor,
          }}>
          Top post from the communities you follow <FireIcon />
        </Text>
      </View>
    </Fragment>
  )
}
