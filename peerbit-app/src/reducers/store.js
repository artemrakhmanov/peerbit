import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './loginReducer'
import redirectReducer from './redirectReducer'

export default configureStore({
  reducer: {
      login: loginReducer,
      redirect: redirectReducer
  }
})