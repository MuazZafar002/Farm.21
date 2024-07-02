import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native'
import {formData} from '../../CustomHooks'
import React from 'react'
import FormInput from '../../Component/formInput'
import tw from 'twrnc'
import {KeyUtils} from '../../constants/Utils/KeyUtils'
import {Loading} from '../../Component'
import {IRegisterProps} from '../../interfaces/user'
import {CreateUser} from '../../core/backend'
import {IUserWithEmailAndUsername} from '../../constants/Utils/GuidedTourUtils'
import {DataUtils} from '../../constants/Utils/DataUtils'
import Popup from '../../Component/common/Popup'

const Signup = ({navigation}: any) => {
  
  const [formValues, handleFormValueChange] = formData({
    fullName: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(true)
  const [validEmail, setValidEmail] = React.useState(true)
  const [validPassword, setValidPassword] = React.useState(true)
  const [validName, setValidName] = React.useState(true)
  const [showModal , setShowModal] = React.useState(false)

  function togglePasswordVisibility() {
    setShowPassword(!showPassword)
  }

  const checkEmail = () => {
    const validEmailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (validEmailRegex.test(formValues?.email)) {
      if (!validEmail) {
        setValidEmail(true)
        return true
      }
      return true
    } else {
      setValidEmail(false)
      return false
    }
  }
  function checkPassword() {
    let passwordValidExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,20}$/
    if (formValues.password.match(passwordValidExp)) {
      if (!validPassword) {
        setValidPassword(true)
        return true
      }
      return true
    } else {
      setValidPassword(false)
      return false
    }
  }

  function checkName() {
    if (formValues.fullName === '') {
      setValidName(false)
      return false
    } else {
      setValidName(true)
      return true
    }
  }

  function handleSubmit() {
    let emailChecker = checkEmail()
    let passwordChecker = checkPassword()
    let nameChecker = checkName()

    if (emailChecker && passwordChecker && nameChecker) {
      setLoading(true)
      const formData: IRegisterProps = {
        email: formValues.email,
        password: formValues.password,
      }
      const userEmailAndUsername: IUserWithEmailAndUsername = {
        email: formValues.email,
        fullName: formValues.fullName,
      }
      CreateUser(formData)
        .then(async (response) => {
          if(response){
            await DataUtils.setData(
              KeyUtils.keys.user,
              JSON.stringify(userEmailAndUsername)
            )
            navigation.navigate(KeyUtils.screens.Verify)
          }else{
            setShowModal(true)
          }
        })
        .catch(error => console.error(error))
        .finally(() => {
          setLoading(false)
        })
    }
  }

  if (loading) {
    return <Loading message="Creating account" />
  }

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{
        flex: 1,
      }}>
        <Popup 
          visible={showModal}
          onClose={() => {
            navigation.goBack()
            setShowModal(false)}
          }
          header='Information'
          paragraph='User already exists'
          button1Text='Ok'
          button1OnPress={() => {
            navigation.goBack()
            setShowModal(false)}}
        />
      <ImageBackground
        source={require('../../../assets/background-image-login.jpeg')}
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}>
          <View style={tw.style('mb-10')}>
            <View style={tw.style('mt-20', 'items-center')}>
              <Image
                source={require('../../../assets/logo.png')}
                style={tw.style('w-80', 'h-40')}
              />
            </View>
            <FormInput
              label="Full Name"
              formKey="fullName"
              placeholder="Full Name"
              handleFormValueChange={handleFormValueChange}
              iconName="pencil"
              validity={validName}
            />
            <FormInput
              label="Email"
              formKey="email"
              placeholder="Email"
              handleFormValueChange={handleFormValueChange}
              iconName="at"
              validEmail={validEmail}
            />
            <FormInput
              label="Password"
              formKey="password"
              placeholder="Password"
              textInputProps={{
                secureTextEntry: showPassword,
              }}
              handleFormValueChange={handleFormValueChange}
              iconName="key"
              passwordVisibility={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              validPassword={validPassword}
            />
          </View>
          <TouchableOpacity
            style={tw.style('items-center justify-center w-full')}
            onPress={handleSubmit}>
            <Text
              style={tw.style(
                'text-black text-lg bg-[#38B137] p-3 rounded-3xl w-50 text-center mt-10 mb-10 font-bold'
              )}>
              Sign Up
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw.style('items-center justify-center w-full')}
            onPress={() => {
              navigation.navigate(KeyUtils.screens.Login)
            }}>
            <Text
              style={tw.style(
                'text-white text-xl text-center p-2 border-white border-2 w-75'
              )}>
              Already have an account
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  )
}

export default Signup
