import { useNavigation } from "@react-navigation/native"
import { useAppSelector } from "../../redux/hooks"
import { TouchableRipple } from "react-native-paper"
import { Image, Text, View } from "react-native"
import { UserIcon } from "../../../assets/iconWrappers/UserIcon"


interface ISearchItem {
    id: string
    name: string
    imageUri: string
    onButtonPress : (id? : string) => void
  }
export const SearchItem = ({name, imageUri, onButtonPress}: ISearchItem) => {
    const theme = useAppSelector(state => state.theme)
    return (
      <TouchableRipple
      onPress={() => onButtonPress()}
        style={{
          marginVertical: 10,
          alignItems: 'center',
        }}
        rippleColor="rgba(0, 0, 0, .32)">
        <View
          style={{
            flexDirection: 'row',
            width: '55%',
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {imageUri ? (
              <Image
                source={{uri: imageUri}}
                style={{width: 50, height: 50, marginTop: 2}}
              />
            ) : (
              <UserIcon width={50} height={50} style={{marginTop: 2}} />
            )}
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: theme.appearance.primaryTextColor,
                marginLeft: 15,
              }}>
              {name}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    )
  }