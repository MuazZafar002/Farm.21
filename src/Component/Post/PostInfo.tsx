import {View, Text, TouchableOpacity} from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import tailwind from 'twrnc'
import {useAppSelector} from '../../redux/hooks'

interface postInfoProps {
  commentCount: number|undefined
  likeCount: number
  isPostLiked: boolean
  onPressLike : () => Promise<void>
}
export const PostInfo = ({commentCount, likeCount ,isPostLiked , onPressLike}: postInfoProps) => {
  const theme = useAppSelector(state => state.theme)

  return (
    <View style={tailwind.style(`flex-row gap-5 mt-3`)}>
      <View style={tailwind.style(`justify-center items-center`)}>
        <TouchableOpacity onPress={onPressLike}>
          {isPostLiked ? (
            <AntIcon name="heart" color="red" size={25} />
          ) : (
            <AntIcon
              name="hearto"
              color={theme.appearance.primaryTextColor}
              size={25}
            />
          )}
        </TouchableOpacity>

        <Text
          style={tailwind.style(`text-[${theme.appearance.primaryTextColor}]`)}>
          {likeCount}
        </Text>
      </View>

      <View style={tailwind.style(`justify-center items-center`)}>
        <MaterialIcon
          name="comment-outline"
          color={theme.appearance.primaryTextColor}
          size={25}
        />

        <Text
          style={tailwind.style(`text-[${theme.appearance.primaryTextColor}]`)}>
          {commentCount}
        </Text>
      </View>
    </View>
  )
}
