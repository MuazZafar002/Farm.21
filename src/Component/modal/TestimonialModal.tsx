import {Modal, Pressable, Text, TextInput, View} from 'react-native'
import {useAppSelector} from '../../redux/hooks'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { useState } from 'react'
import { UiUtils } from '../../constants/Utils/UiUtils'
import { submitTestimonial } from '../../core/backend'

interface TestimonialModalProps {
  isVisible: boolean
  name: string | null
  userId : string
  setModalIsVisible : React.Dispatch<React.SetStateAction<boolean>>
}
export const TestimonialModal = ({isVisible, name , userId , setModalIsVisible}: TestimonialModalProps) => {
  const theme = useAppSelector(state => state.theme)
  const [testimonial , setTestimonial] = useState<string>("")

  const handleTestimonialSubmission = async () => {
    if(testimonial == ''){
        UiUtils.showToast("Testimonial cannot be empty")
    }
    else{
        try {
            await submitTestimonial(testimonial , userId)
            UiUtils.showToast("Testimonial submitted successfully")
        }
        catch(error){
            console.error(error)
            UiUtils.showToast("Error in submitting testimonial")
        }
    }
  }
  return (
    <Modal transparent={true} visible={isVisible}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.8)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            minHeight: '20%',
            backgroundColor: theme.appearance.buttonBackground,
            padding : 10
          }}>
          <Text
            style={{
              color: theme.appearance.buttonText,
              fontWeight: '500',
              fontSize: 20,
            }}>{`Give testimonial to ${name}`}</Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              borderWidth : 1,
              borderColor : theme.appearance.buttonText
            }}>
            <TextInput
              style={{
                flex: 1,
                color: theme.appearance.buttonText,
                padding : 3
              }}
              placeholder="Enter testimonial..."
              placeholderTextColor={theme.appearance.buttonText}
              value={testimonial}
              onChangeText={(text) => setTestimonial(text)}
            />
            <Pressable
                hitSlop={{top : 4, bottom : 4, right : 2, left : 2}}
                onPress={async () => {
                    await handleTestimonialSubmission()
                    setModalIsVisible(false)
                }}
                style={{
                    justifyContent : 'center'
                }}
            >
                <MaterialCommunityIcons
                name="send-circle-outline"
                size={24}
                color={theme.appearance.buttonText}
                />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
