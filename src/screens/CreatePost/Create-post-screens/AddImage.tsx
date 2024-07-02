import React, {useState, useContext, useEffect} from 'react'
import {View, Text, Pressable, Image, Alert, SafeAreaView} from 'react-native'
import * as imagepicker from 'expo-image-picker'
import tailwind from 'twrnc'
import {Entypo} from '@expo/vector-icons'
import {Feather} from '@expo/vector-icons'
import {CommunityContext} from '../../../constants/context/CommunityContext'
import {PostContext} from '../../../constants/context/PostContext'
import {ScrollView} from 'react-native-gesture-handler'
import {Loading} from '../../../Component'
import {useAppSelector} from '../../../redux/hooks'
import {UserIcon} from '../../../../assets/iconWrappers/UserIcon'
import {HeaderWithBack} from '../../../Component/common/HeaderWithBack'
import {Button} from '../../../Component/common/Button'
import {createPost} from '../../../core/backend'
import {useNavigation} from '@react-navigation/native'
import {UiUtils} from '../../../constants/Utils/UiUtils'
import Slider from 'react-native-hook-image-slider'
import Popup from '../../../Component/common/Popup'
import { KeyUtils } from '../../../constants/Utils/KeyUtils'

export default function AddImage() {
  const {title, body, setBody, setTitle} = useContext(PostContext)
  const {name, imageUri, communityId} = useContext(CommunityContext)
  const [isLoading, setIsLoading] = useState(false)
  const [imageUriPost, setImageUriPost] = useState<string[]>([])
  const [showChoices, setshowChoices] = useState(false)
  const [showModal , setShowModal] = useState<boolean>(false)
  const theme = useAppSelector(state => state.theme)
  const navigation = useNavigation()

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

  const clearInputFields = () => {
    setTitle('')
    setBody('')
  }

  const handlePost = async () => {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', body)
    formData.append('communityId', communityId)
    imageUriPost.forEach((image, index) => {
      formData.append('Attachments', {
        uri: image,
        name: `image${index}.jpeg`,
        type: 'image/jpeg',
      })
    })
    setIsLoading(true)
    try {
      await createPost(formData)
      setShowModal(true)
    } catch (error) {
      console.error(error)
      UiUtils.showToast('Error in uploading your post. Kindly try later')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.appearance.background,
      }}>
        {showModal ? (
          <Popup 
            visible={showModal}
            onClose={() => {
              setShowModal(false)
              clearInputFields()
              //@ts-ignore
              navigation.popToTop()
              //@ts-ignore
              navigation.jumpTo(KeyUtils.screens.Feed)
            }}
            header='Post Created'
            paragraph='Your post has been successfully created'
            button1Text='Okay'
            button1OnPress={() => {
              setShowModal(false)
              clearInputFields()
              //@ts-ignore
              navigation.popToTop()
              //@ts-ignore
              navigation.jumpTo(KeyUtils.screens.Feed)
            }}
          />
        ) : null}
      <HeaderWithBack
        title="Add Image"
        rightComponent={
          <Button
            text="Post"
            onClick={handlePost}
            buttonStyle={{height: 30, width: 50}}
          />
        }
        rightComponentStyle={{width: 128}}
      />

      <ScrollView>
        <View style={tailwind.style('flex flex-col ml-2 gap-2 mt-10')}>
          <View style={tailwind.style('flex flex-row gap-2')}>
            {imageUri !== '' ? (
              <Image source={{uri: imageUri}} width={64} height={64} />
            ) : (
              <UserIcon width={64} height={64} />
            )}
            <Text
              style={tailwind.style(
                `text-[${theme.appearance.primaryTextColor}] text-lg font-light mt-4`
              )}>
              {name + '\n'}
            </Text>
          </View>
        </View>
        <Text
          style={tailwind.style(
            `text-[${theme.appearance.primaryTextColor}] text-xl font-bold mb-10`
          )}>
          {title}
        </Text>
        <Text
          style={tailwind.style(
            `text-[${theme.appearance.primaryTextColor}] text-base font-light mb-20`
          )}>
          {body}
        </Text>
        {imageUriPost.length ? (
          <Slider
            images={imageUriPost}
            imageHeight={200}
            activeDotColor="#FFEE58"
            emptyDotColor="#90A4AE"
          />
        ) : null}
        <View style={tailwind.style('flex flex-col items-center mt-10')}>
          {showChoices && (
            <View style={tailwind.style('flex flex-row gap-2')}>
              <Pressable
                style={tailwind.style(
                  'bg-slate-200 rounded-full w-10 justify-center mb-2 p-2 h-12'
                )}
                onPress={async () => await handleCameraInput()}>
                <Entypo name="camera" size={22} color="black" />
              </Pressable>
              <Pressable
                style={tailwind.style(
                  'bg-slate-200 rounded-full w-10 justify-center mb-2 p-2 h-12'
                )}
                onPress={async () => await handleGalleryInput()}>
                <Feather name="paperclip" size={22} color="black" />
              </Pressable>
            </View>
          )}
          <Pressable
            style={tailwind.style(
              'bg-slate-200 w-50 h-8 rounded-3xl justify-center'
            )}
            onPress={() => setshowChoices(!showChoices)}>
            <Text style={tailwind.style('text-center')}>Select Image</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
