import { configureStore } from "@reduxjs/toolkit";
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import AuthReducer from './authSlice.js'

const PersistConfig={
    key:'auth',
    storage
}


const persistauthReducer= persistReducer(PersistConfig,AuthReducer)

// store


const store = configureStore({
    reducer:{
        auth:persistauthReducer
    },
    middleware:(GetdeafultMidleware)=>
        GetdeafultMidleware({
            serializableCheck:false
        })
})

export const persister= persistStore(store)

export default store

