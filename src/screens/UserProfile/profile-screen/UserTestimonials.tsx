import {FlatList, Image, ScrollView, Text, View} from 'react-native'
import tailwind from 'twrnc'
import {useAppSelector} from '../../../redux/hooks'
import {
  useGetTestimonialQuery,
  useLazyGetUserByIdQuery,
} from '../../../redux/rtk/farm21Backend'
import {Loading} from '../../../Component'
import {EmptyState} from '../../../../assets/iconWrappers/EmptyState'
import {UiUtils} from '../../../constants/Utils/UiUtils'
import {useEffect, useState} from 'react'
import {IUser} from '../../../interfaces/user'

interface ITestimonialOfUser {
  user: IUser
  testimonial: string
}

export const UserTestimonials = () => {
  const {
    data: userTestimonials,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTestimonialQuery(undefined)
  const [getUserById] = useLazyGetUserByIdQuery()
  const [loading, setLoading] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [testimonials, setTestimonials] = useState<ITestimonialOfUser[]>([])

  const theme = useAppSelector(state => state.theme)

  useEffect(() => {
    const getUserData = async () => {
      if (userTestimonials?.length) {
        setLoading(true)
        userTestimonials.forEach(async testimonial => {
          const {
            data: userData,
            error,
            isError,
          } = await getUserById(testimonial?.writer)
          if (isError) {
            console.error('Error in fetching user details', error)
            return
          }
          if (userData) {
            const doesExist = testimonials.some(
              item => item.user.id === userData?.id
            )
            if (!doesExist) {
              setTestimonials(prev => [
                ...prev,
                {
                  user: userData,
                  testimonial: testimonial?.testamonial,
                },
              ])
            }
          }
        })
        setLoading(false)
      }
    }
    getUserData()
  }, [isLoading])

  const renderItem = ({item}: {item: ITestimonialOfUser}) => {
    return (
      <View
        style={{
          backgroundColor: theme.appearance.cardBackground,
          width: '100%',
          marginBottom : 5,
          marginTop : 10
        }}>
        <View
          style={{
            alignSelf: 'center',
            flexDirection: 'row',
            marginVertical: 10,
          }}>
          <Image
            source={{uri: item?.user?.profile}}
            style={{
              width: 50,
              height: 50,
              borderRadius: 999,
              marginRight: 10,
            }}
          />
          <View
            style={{
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: theme.appearance.primaryTextColor,
                fontWeight: '700',
                fontSize: 18,
                textAlign: 'center',
              }}>
              {item?.user?.name}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: theme.appearance.bodyColor,
            fontSize: 16,
            fontWeight: '400',
            fontStyle: 'italic',
            textAlign: 'justify',
            alignSelf: 'center',
          }}>
          {item?.testimonial}
        </Text>
      </View>
    )
  }

  if (isLoading || loading) {
    return <Loading />
  }
  if (isError) {
    console.error(error)
    UiUtils.showToast('Error in loading testimonials')
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.appearance.background,
        }}>
        <EmptyState />
      </View>
    )
  }
  return !isLoading && testimonials?.length === 0 ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.appearance.background,
      }}>
      <EmptyState />
    </View>
  ) : (
    <FlatList
      style={{
        backgroundColor: theme.appearance.background,
        flex: 1,
      }}
      data={testimonials}
      renderItem={renderItem}
      keyExtractor={item => item.user.id}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true)
        refetch()
        setRefreshing(false)
      }}
    />
  )
}
