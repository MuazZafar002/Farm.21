import React, {useState } from 'react';
import { Modal, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { KeyUtils } from '../../constants/Utils/KeyUtils';
interface PaymentModalProps {
  visible?: boolean;
  onClose?: () => void;
  price?: string;
  productName?: string;
}

const PaymentModal = ({ visible, onClose, price, productName } : PaymentModalProps) => {
  const [quantity, setQuantity] = useState('');
  const navigation : any =useNavigation();
  const calculateTotal = () => {
    //@ts-ignore
    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseFloat(quantity);
    if (!isNaN(parsedPrice) && !isNaN(parsedQuantity)) {
      return parsedPrice * parsedQuantity;
    }
    return 0;
  };

  const handleCheckout = () => {
    setQuantity('')
    if(onClose) onClose()
    navigation.navigate(KeyUtils.screens.PaymentScreen)
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <BlurView intensity={4} tint="light" style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ padding: 30, borderRadius: 16, backgroundColor: 'white', width: '90%' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Buy {productName}</Text>
            <Text style={{ fontSize: 16, marginBottom: 16 }}>Price of {productName} is: {price}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ flex: 1 }}>Quantity of {productName}:</Text>
              <TextInput
                style={{ flex: 1, borderWidth: 1, padding: 8 }}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
            <Text style={{ fontSize: 16, marginBottom: 16 }}>Total amount is: {calculateTotal().toFixed(2)}</Text>
            <TouchableOpacity
              style={{ backgroundColor: 'blue', padding: 12, borderRadius: 8 }}
              onPress={handleCheckout}
            >
              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Checkout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 16 }} onPress={onClose}>
              <Text style={{ color: 'blue', fontSize: 16, textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default PaymentModal;
