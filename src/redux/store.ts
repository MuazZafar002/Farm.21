import {configureStore} from '@reduxjs/toolkit'
import auth from './reducers/auth.slice'
import theme from './reducers/theme.slice'
import user from './reducers/user.slice'
import {setupListeners} from '@reduxjs/toolkit/query'
import { farm21BackendApi } from './rtk/farm21Backend'

export const store = configureStore({
  reducer: {
    [farm21BackendApi.reducerPath]: farm21BackendApi.reducer,
    auth,
    theme,
    user,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(farm21BackendApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
