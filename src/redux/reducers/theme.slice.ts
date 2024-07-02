import {createSlice} from '@reduxjs/toolkit'
import {dark} from '../../constants/theme/dark'
import {useColorScheme} from 'react-native'
import {Theme} from '../../interfaces/theme'
import { light } from '../../constants/theme/light'

interface ThemeSliceInitialState {
  mode: 'light' | 'dark'
  appearance: Theme
}

interface PayloadData {
  mode: 'light' | 'dark' | 'system'
}

const initialState: ThemeSliceInitialState = {
  mode: 'dark',
  appearance: dark,
}

export const theme = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (
      state: ThemeSliceInitialState,
      action: {payload: PayloadData}
    ) => {
      if (action.payload.mode === 'system') {
        console.log('system')
      } else {
        state.mode = action.payload.mode
        state.appearance = action.payload.mode === 'dark' ? dark : light
      }
    },
  },
})

export const {setTheme} = theme.actions

export default theme.reducer
