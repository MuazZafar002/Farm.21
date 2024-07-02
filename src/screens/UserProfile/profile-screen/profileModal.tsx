import React, {useState} from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from 'react-native'
import {useAppSelector} from '../../../redux/hooks'
import {UserIcon} from '../../../../assets/iconWrappers/UserIcon'
import {Entypo} from '@expo/vector-icons'
import * as imagepicker from 'expo-image-picker'
import {Feather} from '@expo/vector-icons'
import {useAppDispatch} from '../../../redux/hooks'
import tw from 'twrnc'
import {updateProfilePicture} from '../../../core/backend'
import {setUser} from '../../../redux/reducers/user.slice'
import Loader from '../../../Component/common/Loading'
import {UiUtils} from '../../../constants/Utils/UiUtils'
interface ProfileModalProps {
  visible: boolean
  onClose: () => void
}

const ProfileModal: React.FC<ProfileModalProps> = ({visible, onClose}) => {
  const dispatch = useAppDispatch()
  const theme = useAppSelector(state => state.theme)
  const user = useAppSelector(state => state.user.user)
  const [imageUris, setImageUris] = useState<string>('')
  const [showChoices, setshowChoices] = useState(false)
  const [loading, setLoading] = useState(false)
  const profile = user?.profile || ''

  const handleCancel = () => {
    setshowChoices(!showChoices)
    setImageUris('')
    onClose()
  }

  const handleConfirm = async () => {
    setLoading(true)
    if (!imageUris) {
      console.error('No image selected')
      setLoading(false)
      return
    }

    try {
      const response = await updateProfilePicture(imageUris)

      if (response) {
        dispatch(setUser({...user, profile: imageUris}))
      } else {
        UiUtils.showToast('Error in updating profile picture. Please try later')
      }
    } catch (error) {
      console.error('Error changing picture:', error)
      UiUtils.showToast('Error in changing profile pic. Kindly try again later')
    } finally {
      setshowChoices(!showChoices)
      setImageUris('')
      onClose()
      setLoading(false)
    }
  }
  const handleCameraInput = async () => {
    const checkPermission = await imagepicker.getCameraPermissionsAsync()
    if (checkPermission.granted) {
      const image: imagepicker.ImagePickerResult | undefined =
        await imagepicker.launchCameraAsync({
          mediaTypes: imagepicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [7, 3],
          quality: 1,
        })

      if (image?.assets?.length && !image.canceled) {
        const uri = (image.assets as imagepicker.ImagePickerAsset[])[0]?.uri
        if (uri) {
          setImageUris(uri)
        }
      }
    } else {
      const permissionResponse =
        await imagepicker.requestCameraPermissionsAsync()
      if (permissionResponse.granted) {
        const image = await imagepicker.launchCameraAsync({
          mediaTypes: imagepicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [6, 5],
          quality: 1,
        })

        if (image?.assets?.length && !image.canceled) {
          const uri = (image.assets as imagepicker.ImagePickerAsset[])[0]?.uri
          if (uri) {
            setImageUris(uri)
          }
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
    const checkPermission = await imagepicker.getMediaLibraryPermissionsAsync()
    if (checkPermission.granted) {
      const image = await imagepicker.launchImageLibraryAsync({
        mediaTypes: imagepicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [6, 5],
        quality: 1,
      })

      if (image?.assets?.length && !image.canceled) {
        const uri = (image.assets as imagepicker.ImagePickerAsset[])[0]?.uri
        if (uri) {
          setImageUris(uri)
        }
      } else {
        Alert.alert('Cancelled', 'You cancelled the process')
      }
    } else {
      const getPermission =
        await imagepicker.requestMediaLibraryPermissionsAsync()
      if (getPermission.granted) {
        const image = await imagepicker.launchImageLibraryAsync({
          mediaTypes: imagepicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        })

        if (image?.assets?.length && !image.canceled) {
          const uri = (image.assets as imagepicker.ImagePickerAsset[])[0]?.uri
          if (uri) {
            setImageUris(uri)
          }
        } else {
          Alert.alert('Permission not granted', 'Cannot proceed further')
        }
      }
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      {loading ? (
        <Loader message="Posting image..." /> // Display Loading component during image posting
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: theme.appearance.modalBackground,
          }}>
          <View style={{backgroundColor: 'white', padding: 20}}>
            {/* Profile image or user icon */}
            {profile ? (
              <Image
                source={{uri: profile}}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 15,
                  alignSelf: 'center',
                  marginBottom: 20,
                }}
              />
            ) : (
              <View
                style={{
                  backgroundColor: theme.appearance.userIconBackground,
                  alignItems: 'center',
                  width: '50%',
                  marginLeft: 70,
                }}>
                <UserIcon
                  width={100}
                  height={100}
                  style={{
                    alignSelf: 'center',
                    borderRadius: 15,
                    marginBottom: 20,
                  }}
                />
              </View>
            )}
            {/* Change Profile Picture text */}
            <View style={tw.style('flex flex-col items-center')}>
              {showChoices && (
                <View style={tw.style('flex flex-row gap-2')}>
                  <Pressable
                    style={[
                      tw`rounded-full w-10 justify-center mb-2 p-2 h-12`,
                      {backgroundColor: theme.appearance.iconBackground},
                    ]}
                    onPress={async () => await handleCameraInput()}>
                    <Entypo name="camera" size={22} color="black" />
                  </Pressable>
                  <Pressable
                    style={[
                      tw`rounded-full w-10 justify-center mb-2 p-2 h-12`,
                      {backgroundColor: theme.appearance.iconBackground},
                    ]}
                    onPress={async () => await handleGalleryInput()}>
                    <Feather name="paperclip" size={22} color="black" />
                  </Pressable>
                </View>
              )}
              <Pressable
                style={[
                  tw`w-50 h-8 mb-10 rounded-3xl justify-center font-black`,
                  {backgroundColor: theme.appearance.buttonBackground},
                ]}
                onPress={() => setshowChoices(!showChoices)}>
                <Text
                  style={[
                    tw`text-center`,
                    {color: theme.appearance.buttonText},
                  ]}>
                  Set New Profile Picture
                </Text>
              </Pressable>
            </View>
            <View style={{marginBottom: 20}}>
              {imageUris ? (
                <View style={{alignItems: 'center', marginBottom: 20}}>
                  <Text
                    style={{fontSize: 16, marginBottom: 10, color: 'green'}}>
                    Your image has been selected press change now to change
                    profile picture
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'black',
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: 'center',
                      width: '100%',
                    }}
                    onPress={handleConfirm}>
                    <Text style={{fontSize: 16, color: 'white'}}>
                      Change Now
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            {/* Cancel button */}
            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
              onPress={handleCancel}>
              <Text style={{fontSize: 16, color: 'white'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Modal>
  )
}

export default ProfileModal
