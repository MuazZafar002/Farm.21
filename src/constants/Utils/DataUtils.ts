import AsyncStorage from '@react-native-async-storage/async-storage'
import { IUserWithEmailAndUsername } from './GuidedTourUtils'

export class DataUtils {
  static async setData(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  static async getData(key: string) {
    try {
      const results = await AsyncStorage.getItem(key)
      return results
    } catch (error) {
      console.error(error)
      return null
    }
  }

  static async clearData(key : string) {
    try {
      await AsyncStorage.removeItem(key)
      return true
    } catch (error){
      console.error(error)
      return false
    }
  }
  
  static async getUserEmailAndUsername(key : string) {
    try {
      const userData = await AsyncStorage.getItem(key)
      if(userData){
        const JsonData : IUserWithEmailAndUsername = await JSON.parse(userData)
        return JsonData
      }else{
        return null
      }
    }
    catch(error){
      console.error(error)
      return null
    }
  }
}
