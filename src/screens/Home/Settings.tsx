import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useAppSelector } from '../../redux/hooks';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyUtils } from '../../constants/Utils/KeyUtils';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Settings = ({navigation} : any) => {
  const theme = useAppSelector((state) => state.theme);

  const handleGeneralInformation = () => {
    navigation.navigate(KeyUtils.screens.GeneralInformation)
  };

  const handlePasswordAndSecurity = () => {
    navigation.navigate(KeyUtils.screens.PasswordAndSecurity)
  };

  const handleDeactivateAccount = () => {
    console.log('Hello from Deactivate Account');
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.appearance.cardBackground }]}>
      <View style= {{marginTop : 10}}>
      <View style={tw`p-4`}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mb-4`}>
            <Icon name="arrow-left" size={24} color={theme.appearance.primaryTextColor} />
          </TouchableOpacity>
        <TouchableOpacity style={tw`mt-6`} onPress={handleGeneralInformation}>
          <Text style={[tw`text-center mb-10 w-full border-b-2`, { color: theme.appearance.primaryTextColor, borderColor: theme.appearance.primaryTextColor }]}>
            General Information
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePasswordAndSecurity}>
          <Text style={[tw`text-center mb-10 w-full border-b-2`, { color: theme.appearance.primaryTextColor, borderColor: theme.appearance.primaryTextColor }]}>
            Password and Security
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`mb-4`} onPress={handleDeactivateAccount}>
          <Text style={[tw`text-center mb-10 w-full border-b-2`, { color: theme.appearance.primaryTextColor, borderColor: theme.appearance.primaryTextColor }]}>
            Deactivate Account
          </Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};



