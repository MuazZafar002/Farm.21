import {useNavigation} from '@react-navigation/native'
import {
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useAppDispatch, useAppSelector} from '../../redux/hooks'
import {CrossIcon} from '../../../assets/iconWrappers/CrossIcon'
import {TextInput} from 'react-native-gesture-handler'
import {useState} from 'react'
import {Button} from '../../Component/common/Button'
import {UserIcon} from '../../../assets/iconWrappers/UserIcon'
import {createCommunity} from '../../core/backend'
import {Loading} from '../../Component'
import * as imagepicker from 'expo-image-picker'
import {Entypo} from '@expo/vector-icons'
import {Feather} from '@expo/vector-icons'
import {UiUtils} from '../../constants/Utils/UiUtils'
import {KeyUtils} from '../../constants/Utils/KeyUtils'
import { appendCommunity } from '../../redux/reducers/user.slice'
interface IFormValues {
  name: string
  desc: string
}

export const CreateCommunity = () => {
  const navigation = useNavigation()
  const theme = useAppSelector(state => state.theme)
  const [showLoader, setShowLoader] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<IFormValues>({
    name: '',
    desc: '',
  })
  const [imageUriPost, setImageUriPost] = useState<string[]>([])
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const handleCameraInput = async () => {
    setImageUriPost([])
    //check if permission granted
    const checkPermission = await imagepicker.getCameraPermissionsAsync()
    if (checkPermission.granted) {
      const image = await imagepicker.launchCameraAsync({
        mediaTypes: imagepicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      })
      if (!image?.canceled) {
        image?.assets?.forEach(asset => {
          setImageUriPost(prev => {
            return [...prev, asset?.uri]
          })
        })
      }
    }
    //if not granted then ask for permission
    else {
      const permissionResponse =
        await imagepicker.requestCameraPermissionsAsync()
      if (permissionResponse.granted) {
        const image = await imagepicker.launchCameraAsync({
          mediaTypes: imagepicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          aspect: [4, 3],
          quality: 1,
        })
        if (!image.canceled) {
          image?.assets?.forEach(asset => {
            setImageUriPost(prev => {
              return [...prev, asset?.uri]
            })
          })
        } else {
          Alert.alert('Cancelled', 'You cancelled the process')
        }
      } else {
        Alert.alert(
          'Permission',
          'Permission not granted. Cannot proceed further'
        )
      }
    }
  }
  const handleGalleryInput = async () => {
    setImageUriPost([])
    //check if permission granted
    const checkPermission = await imagepicker.getMediaLibraryPermissionsAsync()
    if (checkPermission.granted) {
      const image = await imagepicker.launchImageLibraryAsync({
        mediaTypes: imagepicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
      })

      if (!image.canceled) {
        image?.assets?.forEach(asset => {
          setImageUriPost(prev => {
            return [...prev, asset?.uri]
          })
        })
      } else {
        Alert.alert('Cancelled', 'You cancelled the process')
      }
    } else {
      const getPermission =
        await imagepicker.requestMediaLibraryPermissionsAsync()
      if (getPermission.granted) {
        const image = await imagepicker.launchImageLibraryAsync({
          mediaTypes: imagepicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          aspect: [4, 3],
          quality: 1,
          base64: true,
        })

        if (!image.canceled) {
          image?.assets?.forEach(asset => {
            setImageUriPost(prev => {
              return [...prev, asset?.uri]
            })
          })
        } else {
          Alert.alert('Permssion not granted', 'Cannot proceed further')
        }
      }
    }
  }
  const handleSubmit = async () => {
    setShowLoader(true)

    const response = await createCommunity(
      formValues?.name,
      formValues?.desc,
      imageUriPost[0]
    )
    if (response) {
      setShowLoader(false)
      //@ts-ignore
      dispatch(appendCommunity(response.id))
      //@ts-ignore
      navigation.replace(KeyUtils.screens.CommunityDetails, {id: response.id})
      UiUtils.showToast("Community Created Successfully. To see this community, Kindly load the page again")
    } else {
      setShowLoader(false)
      UiUtils.showToast("Error occurred in creating Community. Kindly try later")
      navigation.goBack()
    }
  }

  if (showLoader) {
    return <Loading message="Creating Community" />
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.appearance.background,
      }}>
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          marginLeft: 5,
        }}>
        <CrossIcon />
      </Pressable>
      <View
        style={{
          paddingHorizontal: 35,
          paddingTop: 20,
          flex: 1,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              borderRadius: 999,
              backgroundColor: theme.appearance.cardBackground,
              width: 120,
              height: 120,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {imageUriPost.length ? (
              <Image
                source={{uri: imageUriPost[0]}}
                width={120}
                height={120}
                style={{
                  borderRadius: 999,
                }}
              />
            ) : (
              <UserIcon width={100} height={100} />
            )}
          </View>
          <View
            style={{
              flexDirection: 'column',
            }}>
            {showImagePicker ? (
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  marginLeft: 20,
                  marginBottom: 5,
                }}>
                <Pressable
                  style={{
                    backgroundColor: 'white',
                    width: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    height: 30,
                  }}
                  onPress={async () => {
                    setShowImagePicker(false)
                    await handleCameraInput()
                  }}>
                  <Entypo name="camera" size={22} color="black" />
                </Pressable>
                <Pressable
                  style={{
                    backgroundColor: 'white',
                    width: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    height: 30,
                  }}
                  onPress={async () => {
                    setShowImagePicker(false)
                    await handleGalleryInput()
                  }}>
                  <Feather name="paperclip" size={22} color="black" />
                </Pressable>
              </View>
            ) : null}
            <View
              style={{
                marginLeft: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Button
                text="Add Image"
                onClick={() => setShowImagePicker(prev => !prev)}
                buttonStyle={{width: 100, height: 40}}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            width: '100%',
          }}>
          <View>
            <Text
              style={{
                color: theme.appearance.primaryTextColor,
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 5,
              }}>
              Name
            </Text>
            <TextInput
              value={formValues.name}
              onChangeText={text => setFormValues({...formValues, name: text})}
              style={{
                color: theme.appearance.primaryTextColor,
                backgroundColor: theme.appearance.cardBackground,
                height: 35,
                padding: 5,
              }}
              placeholder="Name your community"
              placeholderTextColor={theme.appearance.primaryTextColor}
            />
          </View>
          <View
            style={{
              marginTop: 20,
            }}>
            <Text
              style={{
                color: theme.appearance.primaryTextColor,
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 5,
              }}>
              Description
            </Text>
            <TextInput
              value={formValues.desc}
              onChangeText={text => setFormValues({...formValues, desc: text})}
              style={{
                color: theme.appearance.primaryTextColor,
                backgroundColor: theme.appearance.cardBackground,
                minHeight: 80,
                padding: 5,
              }}
              placeholder="Enter description"
              placeholderTextColor={theme.appearance.primaryTextColor}
              multiline={true}
            />
          </View>
        </View>
      </View>
        <Button text="Create Community" onClick={handleSubmit} />
    </SafeAreaView>
  )
}
