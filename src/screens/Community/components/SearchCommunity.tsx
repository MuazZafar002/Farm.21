import {FlatList, Image, ScrollView, Text, View} from 'react-native'
import {ICommunity, ICommunityDetails} from '../../../interfaces/community'
import {useLazyGetCommunityDetailsQuery} from '../../../redux/rtk/farm21Backend'
import {useEffect, useState} from 'react'
import {Loading} from '../../../Component'
import {useNavigation} from '@react-navigation/native'
import {KeyUtils} from '../../../constants/Utils/KeyUtils'
import {SearchItem} from '../../../Component/common/SearchItem'
import {EmptyState} from '../../../../assets/iconWrappers/EmptyState'
import {
  QueryActionCreatorResult,
  QueryDefinition,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query'

interface ISearchCommunity {
  communityData: ICommunityDetails[] | undefined
  searchText: string
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      void,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      never,
      ICommunity,
      'farm21BackendApi'
    >
  >
}
interface ISearchItem {
  id: string
  name: string
  imageUri: string
}
export const SearchCommunity = ({
  communityData,
  searchText,
  refetch
}: ISearchCommunity) => {
  const [communities, setCommunites] = useState<ISearchItem[]>([])
  const [communityDetails] = useLazyGetCommunityDetailsQuery()
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const navigation = useNavigation()

  useEffect(() => {
    const getDetails = () => {
      return new Promise<boolean>(resolve => {
        if (!communityData) return resolve(false)
        const promises = communityData?.map(async (item: ICommunityDetails) => {
          const {
            data: communityDetailsData,
            error: communityDetailsError,
            isError,
          } = await communityDetails(item.id, true)
          const communityExists = communities.some(
            community => community.id === communityDetailsData?.id
          )
          if (!communityExists) {
            setCommunites(prev => [
              ...prev,
              {
                name: communityDetailsData?.name,
                imageUri: communityDetailsData?.profile,
                id: communityDetailsData?.id,
              } as ISearchItem,
            ])
          }
          if (isError) {
            console.error(communityDetailsError)
          }
        })

        Promise.all(promises).then(() => resolve(true))
      })
    }
    refetch()
    getDetails().then(() => setLoading(false))
  }, [])

  if (loading) {
    return <Loading message="Loading Communities" />
  }

  const onButtonPress = (id: string) => {
    //@ts-ignore
    navigation.navigate(KeyUtils.screens.CommunityDetails, {
      id: id,
    })
  }
  const filteredCommunities = communities.filter(item =>
    item.name?.toLowerCase().includes(searchText.toLowerCase())
  )
  return filteredCommunities.length > 0 ? (
    <FlatList
      data={filteredCommunities}
      renderItem={({item}) => (
        <SearchItem
          key={item.id}
          id={item.id}
          name={item.name}
          imageUri={item.imageUri}
          onButtonPress={() => onButtonPress(item.id)}
        />
      )}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true)
        refetch()
        setRefreshing(false)
      }}
    />
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <EmptyState />
    </View>
  )
}
