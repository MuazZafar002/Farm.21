import {createSlice} from '@reduxjs/toolkit'
import moment from 'moment'

export interface IUser {
  name: string ,
  email: string ,
  coins: number,
  desc: string,
  ts: string,
  image: string | null
  rank : number
}

export interface AuthInitialState {
  uid: string
  user: IUser
}
const initialState: AuthInitialState = {uid: '', user: {
  name : '',
  email : '',
  coins : 0,
  desc : '',
  ts : moment().valueOf().toString(),
  image : null,
  rank : 0
}}

const auth = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.uid = action.payload.uid
      state.user = action.payload.user
    },
  },
})

export const {setAuth} = auth.actions
export default auth.reducer
