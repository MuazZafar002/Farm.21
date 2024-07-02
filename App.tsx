import React from 'react'
import 'react-native-gesture-handler'
import {StatusBar} from 'expo-status-bar'
import AppNavigation from './src/Navigation/AppNavigation'
import {Provider} from 'react-redux'
import {RootSiblingParent} from 'react-native-root-siblings'

import {store} from './src/redux/store'

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" backgroundColor="#000000" />
      <RootSiblingParent>
        <AppNavigation />
      </RootSiblingParent>
    </Provider>
  )
}
