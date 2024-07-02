import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure to install the library
import { Button } from '../../Component/common/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '../../redux/hooks';
import Popup from '../../Component/common/Popup';
export const PasswordAndSecurity = ({ navigation }:any) => {
  const theme = useAppSelector((state) => state.theme);

  const [oldPassword, setOldPassword] = useState(''); 
  const [newPassword, setNewPassword] = useState(''); 
  const [reEnterNewPassword, setReEnterNewPassword] = useState(''); 
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [errorOldPassword, setErrorOldPassword] = useState('');
  const [errorReEnterPassword, setErrorReEnterPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal , setShowModal] = useState<boolean>(false)

  const handleEyePress = (type:any) => {
    switch (type) {
      case 'old':
        setShowOldPassword(!showOldPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'reEnter':
        setShowReEnterPassword(!showReEnterPassword);
        break;
      default:
        break;
    }
  };

  const handleSavePassword = () => {
    // Check if any field is empty
    if (!oldPassword || !newPassword || !reEnterNewPassword) {
      setError('Please fill in all fields');
      setErrorOldPassword('');
      setErrorReEnterPassword(''); // Clear other error messages
      return;
    }
    
    // Check if the new password and re-entered password match
    if (newPassword !== reEnterNewPassword) {
      setErrorReEnterPassword('Passwords do not match');
      setErrorOldPassword(''); // Clear other error message
      setError('');
      return;
    }

    setShowModal(true)
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.appearance.cardBackground }]}>
      {showModal ? (
        <Popup 
          visible={showModal}
          onClose={() => setShowModal(false)}
          header="Not yet implemented"
          paragraph="This feature will be available in future releases"
          button1Text='Okay'
          button1OnPress={() => setShowModal(false)}
        />
      ) : null}
      <View style={{ marginTop: 20 }}>
        <View style={tw`p-4`}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mb-4`}>
            <Icon name="arrow-left" size={24} color={theme.appearance.primaryTextColor} />
          </TouchableOpacity>

          <View
            style={[
              tw`border-2 p-2 mb-4`,
              { borderColor: errorOldPassword ? theme.appearance.errorMessage : theme.appearance.primaryTextColor, backgroundColor: theme.appearance.messageBackground },
            ]}>
            <Text style={[tw`mb-2`, { fontWeight: 'bold', color: theme.appearance.primaryTextColor }]}>Old Password</Text>
            <TextInput
              style={[{ color: theme.appearance.primaryTextColor }]}
              placeholder="Old Password"
              placeholderTextColor={theme.appearance.primaryTextColor}
              value={oldPassword}
              secureTextEntry={!showOldPassword}
              onChangeText={(text) => {
                setOldPassword(text);
                setErrorOldPassword(''); // Clear error message when typing
                setError('');
              }}
            />
            <TouchableOpacity
              style={tw.style('absolute right-2 top-2')}
              onPress={() => handleEyePress('old')}>
              <Icon name={showOldPassword ? 'eye' : 'eye-slash'} size={20} color="white" />
            </TouchableOpacity>
          </View>
          {errorOldPassword ? <Text style={[tw`mb-2`, { color: theme.appearance.errorMessage }]}>{errorOldPassword}</Text> : null}

          <View
            style={[
              tw`border-2 p-2 mb-4`,
              { borderColor: errorReEnterPassword ? theme.appearance.errorMessage : theme.appearance.primaryTextColor, backgroundColor: theme.appearance.messageBackground },
            ]}>
            <Text style={[tw`mb-2`, { fontWeight: 'bold', color: theme.appearance.primaryTextColor }]}>New Password</Text>
            <TextInput
              style={[{ color: theme.appearance.primaryTextColor }]}
              secureTextEntry={!showNewPassword}
              placeholder="New Password"
              placeholderTextColor={theme.appearance.primaryTextColor}
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setError('');
              }}
            />
            <TouchableOpacity
              style={tw.style('absolute right-2 top-2')}
              onPress={() => handleEyePress('new')}>
              <Icon name={showNewPassword ? 'eye' : 'eye-slash'} size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View
            style={[
              tw`border-2 p-2 mb-4`,
              { borderColor: errorReEnterPassword ? theme.appearance.errorMessage : theme.appearance.primaryTextColor, backgroundColor: theme.appearance.messageBackground },
            ]}>
            <Text style={[tw`mb-2`, { fontWeight: 'bold', color: theme.appearance.primaryTextColor }]}>Re-enter New Password</Text>
            <TextInput
              style={[{ color: theme.appearance.primaryTextColor }]}
              secureTextEntry={!showReEnterPassword}
              placeholder="Re-enter New Password"
              placeholderTextColor={theme.appearance.primaryTextColor}
              value={reEnterNewPassword}
              onChangeText={(text) => {
                setReEnterNewPassword(text);
                setErrorReEnterPassword(''); // Clear error message when typing
                setError('');
              }}
            />
            <TouchableOpacity
              style={tw.style('absolute right-2 top-2')}
              onPress={() => handleEyePress('reEnter')}>
              <Icon name={showReEnterPassword ? 'eye' : 'eye-slash'} size={20} color="white" />
            </TouchableOpacity>
          </View>
          {errorReEnterPassword ? <Text style={[tw`mb-2`, { color: theme.appearance.errorMessage }]}>{errorReEnterPassword}</Text> : null}
          {error ? <Text style={[tw`mb-2`, { color: theme.appearance.errorMessage }]}>{error}</Text> : null}
          <View style={tw.style('mt-10')}>
            <Button text="Save Changes" onClick={handleSavePassword} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
