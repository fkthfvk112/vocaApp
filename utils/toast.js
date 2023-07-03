import Toast from 'react-native-toast-message';

export default function showToast(message){
  Toast.show({
    type: 'info',
    text1: message,
    visibilityTime: 2000,
  });
};
