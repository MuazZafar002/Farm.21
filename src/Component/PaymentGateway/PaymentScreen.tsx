import React, { useState } from 'react';
import { View, Button, Text, TouchableOpacity, Alert } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { KeyUtils } from '../../constants/Utils/KeyUtils';
import { useAppSelector } from '../../redux/hooks';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome';

function PaymentScreen({ navigation }: any) {
  const theme = useAppSelector((state) => state.theme);
  const { confirmPayment, loading } = useConfirmPayment();

  const [isCardValid, setIsCardValid] = useState(false);

  const handlePayPress = () => {
    if (!isCardValid) {
      Alert.alert('Please fill in all required card details.');
      return;
    }

    Alert.alert(
      'Payment Received',
      'Your payment has been successfully received.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate(KeyUtils.screens.Marketplace);
          },
        },
      ]
    );
  };

  return (
    <View
      style={{
        backgroundColor: theme.appearance.background,
        flex: 1,
        width: '100%',
      }}>
      <View style={tw`p-4`}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mb-4`}>
          <Icon name="arrow-left" size={24} color={theme.appearance.primaryTextColor} />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          marginTop: 30,
          fontSize: 40,
          fontWeight: 'bold',
          textAlign: 'center',
          color: theme.appearance.primaryTextColor,
          marginBottom: 30,
        }}>
        Enter Details
      </Text>
      <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: 'white',
          textColor: 'black',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
          marginBottom: 70,
        }}
        onCardChange={(cardDetails) => {
          // Check if all required fields are filled
          setIsCardValid(cardDetails.complete);
          console.log('cardDetails', cardDetails);
        }}
        onFocus={(focusedField) => {
          console.log('focusField', focusedField);
        }}
      />
      <Button onPress={handlePayPress} title="Pay" disabled={loading || !isCardValid} />
    </View>
  );
}

export default PaymentScreen;
