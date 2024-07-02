import Toast from 'react-native-root-toast';

export class UiUtils {
    static showToast = (message : string) => {
        return Toast.show(message)
    }
}