import {FlatList, View} from 'react-native'
import {Loading} from '../../../Component'
import {useEffect, useState} from 'react'
import {useAppSelector} from '../../../redux/hooks'
import {Post} from '../../../Component/Post/Post'
import {IPost, IPostApiResponse} from '../../../interfaces/post'
import {
  useGetUserPostsQuery,
  useLazyGetPostByIdQuery,
} from '../../../redux/rtk/farm21Backend'
import {UiUtils} from '../../../constants/Utils/UiUtils'
import {EmptyState} from '../../../../assets/iconWrappers/EmptyState'

export default function UserPosts() {
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const theme = useAppSelector(state => state.theme)
  const [userPosts, setUserPosts] = useState<IPost[]>([])
  const [getPostById] = useLazyGetPostByIdQuery()
  const {
    data: posts,
    isError,
    error,
    isLoading: isLoadingPosts,
    refetch
  } = useGetUserPostsQuery()

  const fetchPostDetails = async (id: string) => {
    const {
      data: postData,
      error: postError,
      isError,
    } = await getPostById(id, true)
    if (isError) {
      throw postError
    } else {
      if (postData) {
        const postExists = userPosts.some(post => post.id === postData?.id)
        if (!postExists) {
          setUserPosts(prev => [...prev, postData])
        }
      }
    }
  }

  const fetchPosts = (posts: IPostApiResponse[] | undefined) => {
    if (posts?.length) {
      const promises = posts.map(async post => {
        await fetchPostDetails(post.id)
      })
      Promise.all(promises)
        .then()
        .catch(error => {
          console.error(error)
        })
        .finally(() => setLoading(false))
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!isLoadingPosts) {
      fetchPosts(posts)
    }
  }, [posts])

  if (isError) {
    UiUtils.showToast('Error in fetching your posts')
    console.error(error)
  }

  if (loading || isLoadingPosts) {
    return <Loading />
  }

  return userPosts.length ? (
    <FlatList
      style={{
        backgroundColor: theme.appearance.background,
      }}
      data={userPosts}
      renderItem={item => <Post post={item.item} key={item.index} />}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      refreshing={refresh}
      onRefresh={() => {
        setRefresh(true)
        refetch()
        setRefresh(false)
      }}
    />
  ) : (
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
