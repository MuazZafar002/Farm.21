// Popup.tsx
import React, { FC, ReactNode } from 'react';
import { Modal, Text, View, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import tw from 'twrnc';
import {useAppSelector} from '../../redux/hooks'


interface PopupProps {
  visible: boolean;
  onClose: () => void;
  header: string;
  paragraph: ReactNode;
  button1Text: string;
  button1OnPress: () => void;
  button2Text?: string;
  button2OnPress?: () => void;
}

const Popup: FC<PopupProps> = ({
  visible,
  onClose,
  header,
  paragraph,
  button1Text,
  button1OnPress,
  button2Text,
  button2OnPress,
}) => {
  const theme = useAppSelector(state => state.theme)
  const renderButtons = () => {
    if (button2Text && button2OnPress) {
      // Two-button variant
      return (
        <View>
          <TouchableOpacity
            style={tw`p-2 rounded-2xl w-55 bg-[${theme.appearance.heartReact}]`}
            onPress={button1OnPress}
          >
            <Text style={tw`text-center font-bold text-[${theme.appearance.primaryTextColor}]`}>{button1Text}</Text>
          </TouchableOpacity>
          <TouchableOpacity
           style={tw`p-2 mt-2 rounded-2xl w-55 bg-[${theme.appearance.popupButton}]`}
            onPress={button2OnPress}
          >
            <Text style={tw`text-center font-bold text-[${theme.appearance.primaryTextColor}]`}>{button2Text}</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      // One-button variant
      return (
        <TouchableOpacity
          onPress={button1OnPress}
          style={{
            width : '75%',
            backgroundColor: theme.appearance.popupButton,
            padding : 2,
            alignSelf : 'center',
            borderRadius : 20,
            height : 30,
            justifyContent : 'center'
          }}
        >
          <Text
            style={{
              color: theme.appearance.primaryTextColor,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >{button1Text}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <BlurView style={tw.style('flex-1')} intensity={5} tint="light">
        <View style={tw.style('flex-1 justify-center items-center')}>
          <View style={tw`p-6 rounded-lg w-3/4 bg-[${theme.appearance.popupBackground}]`}>
            <Text style={tw`text-xl font-bold mb-4 text-center text-[${theme.appearance.popupText}]`}>{header}</Text>
            <Text style={tw`text-base  mb-4 text-center text-[${theme.appearance.popupText}]`}>{paragraph}</Text>
            {renderButtons()}
            <TouchableOpacity style={tw.style('mt-4')} onPress={onClose}>
              <Text style={tw`text-center text-[${theme.appearance.popupText}]`}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default Popup;
