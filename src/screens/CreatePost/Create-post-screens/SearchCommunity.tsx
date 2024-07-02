import {View, ScrollView} from 'react-native'
import {useContext, useEffect, useState} from 'react'
import {CommunityContext} from '../../../constants/context/CommunityContext'
import {KeyUtils} from '../../../constants/Utils/KeyUtils'
import {useAppSelector} from '../../../redux/hooks'
import {HeaderWithBackAndSearch} from '../../../Component/common/HeaderWithBackAndSearch'
import {
  useLazyGetCommunityDetailsQuery,
  useLazyGetUserCommunityQuery,
} from '../../../redux/rtk/farm21Backend'
import {useNavigation} from '@react-navigation/native'
import {Loading} from '../../../Component'
import {SearchItem} from '../../../Component/common/SearchItem'
import {EmptyState} from '../../../../assets/iconWrappers/EmptyState'
interface ISearchItem {
  id: string
  name: string
  imageUri: string
}

export default function SearchCommunity() {
  const {setName, setImageUri, setCommunityId} = useContext(CommunityContext)
  const [searchText, setSearchText] = useState('')
  const [isSearchFocused, setisSearchFocued] = useState<boolean>(false)
  const [communities, setCommunites] = useState<ISearchItem[]>([])
  const [communityDetails] = useLazyGetCommunityDetailsQuery()
  const [getCommunity] = useLazyGetUserCommunityQuery()
  const [loading, setLoading] = useState<boolean>(true)
  const theme = useAppSelector(state => state.theme)
  const navigation = useNavigation()

  useEffect(() => {
    const getDetails = ({communityData}: {communityData: [{id: string}]}) => {
      return new Promise<boolean>(resolve => {
        if (!communityData) return resolve(false)
        const promises = communityData?.map(async (item: {id: string}) => {
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

    const getCommunities = () => {
      return new Promise<[{id: string}] | undefined>(
        async (resolve, reject) => {
          const {data, isError, error} = await getCommunity(undefined)
          if (isError) {
            reject(error)
          } else {
            resolve(data?.communities)
          }
        }
      )
    }

    getCommunities()
      .then(async response => {
        if (response) {
          await getDetails({communityData: response})
        }
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Loading message="Loading Communities" />
  }

  const onButtonPress = (name: string, profile: string, id: string) => {
    setName(name)
    setCommunityId(id)
    if (profile) {
      setImageUri(profile)
    } else {
      setImageUri('')
    }
    //@ts-ignore
    navigation.navigate(KeyUtils.screens.AddImage)
  }

  const filteredCommunities = communities
    .filter(item => item.name?.toLowerCase().includes(searchText.toLowerCase()))
    .map(item => (
      <SearchItem
        key={item.id}
        id={item.id}
        name={item.name}
        imageUri={item.imageUri}
        onButtonPress={() => onButtonPress(item.name, item.imageUri, item.id)}
      />
    ))
  return (
    <View style={{backgroundColor: theme.appearance.background, flexGrow: 1}}>
      <HeaderWithBackAndSearch
        searchText={searchText}
        setSearchText={setSearchText}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setisSearchFocued}
        placeholder="Search Community"
      />
      {filteredCommunities.length > 0 ? (
        <ScrollView
          contentContainerStyle={{paddingBottom : '20%'}}
        >{filteredCommunities}</ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <EmptyState />
        </View>
      )}
    </View>
  )
}
