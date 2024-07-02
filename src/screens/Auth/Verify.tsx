import React, {useRef, useState} from 'react'
import {Text, View, TextInput, StyleSheet, Alert} from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {useAppSelector} from '../../redux/hooks'
import {Button} from '../../Component/common/Button'
import {
  GuidedTourUtils,
  IUserWithEmailAndUsername,
} from '../../constants/Utils/GuidedTourUtils'
import {KeyUtils} from '../../constants/Utils/KeyUtils'
import {IVerifyProps} from '../../interfaces/user'
import {VerifyUser} from '../../core/backend'
import {DataUtils} from '../../constants/Utils/DataUtils'
import {Loading} from '../../Component'
import {UiUtils} from '../../constants/Utils/UiUtils'
import Popup from '../../Component/common/Popup'

export const Verify = ({navigation}: any) => {
  const theme = useAppSelector(state => state.theme)
  const [token, setToken] = useState<string[]>(Array(6))
  const [loader, setLoader] = useState<boolean>(false)
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ]
  const [showModal, setShowModal] = useState<boolean>(false)

  const focusNextInput = (index: number) => {
    if (index < inputRefs.length - 1) {
      inputRefs[index + 1]?.current?.focus()
    }
  }

  if (loader) {
    return <Loading />
  }

  const handleVerification = async () => {
    const undefinedValue = token.filter(item => item === undefined)
    if (undefinedValue.length > 0) {
      Alert.alert('Error', 'Token is not complete')
      console.error('Token is not complete')
      return
    }
    const userDetails = await DataUtils.getUserEmailAndUsername(
      KeyUtils.keys.user
    )
    if (userDetails) {
      setLoader(true)
      const verificationDetails: IVerifyProps = {
        email: userDetails?.email,
        token: token.join(''),
        name: userDetails?.fullName,
      }
      VerifyUser(verificationDetails)
        .then(async response => {
          if (response) {
            await GuidedTourUtils.setVerificationCompleted()
            UiUtils.showToast('Verified successfully. Kindly login')
            navigation.navigate(KeyUtils.screens.Login)
          } else {
            setShowModal(true)
          }
        })
        .catch(error => {
          UiUtils.showToast("An error occurred in verification")
          console.error(error)})
        .finally(() => setLoader(false))
    } else {
      navigation.navigate(KeyUtils.screens.Login)
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.appearance.background,
        alignItems: 'center',
      }}>
      <View
        style={{
          marginTop: 48,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Popup 
            visible={showModal}
            onClose={() => {
              setShowModal(false)
            }}
            header='Information'
            paragraph='Invalid token. Kindly check your token and try again'
            button1Text='Ok'
            button1OnPress={() => {
              setShowModal(false)
            }}
          />
        <Text
          style={{
            color: theme.appearance.primaryTextColor,
            fontSize: 20,
            textAlign: 'center',
          }}>
          Enter the verification code received on your email
        </Text>
      </View>
      <View style={styles.container}>
        {Array.from({length: 6}).map((_, index) => (
          <TextInput
            key={index}
            ref={inputRefs[index]}
            style={[
              styles.input,
              {marginLeft: index > 0 ? 15 : 0},
              {
                borderColor: theme.appearance.primaryTextColor,
                color: theme.appearance.primaryTextColor,
              },
            ]}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={value => {
              setToken(prev => {
                const prevToken = [...prev]
                prevToken[index] = value
                return prevToken
              })
              if (value.length === 1) {
                focusNextInput(index)
              }
            }}
          />
        ))}
      </View>
      <View
        style={{
          flex: 1,
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        <Button
          text="Verify"
          onClick={handleVerification}
          buttonStyle={{width: 164}}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  input: {
    width: 40,
    height: 40,
    borderBottomWidth: 1,
    textAlign: 'center',
    fontSize: 24,
  },
})
