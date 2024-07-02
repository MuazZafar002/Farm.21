import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NativeModules} from 'react-native'

const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0]

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({host}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!