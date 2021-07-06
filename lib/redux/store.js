import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
    FLUSH, PAUSE,
    PERSIST, persistReducer, persistStore, PURGE,
    REGISTER, REHYDRATE
} from 'redux-persist';
import storage from './storage';
import compareReducer from './slices/compareSlice';

const persistConfig = {
    key: 'root',
    version: 1,
    storage
}

export const store = configureStore({
    reducer: {
        compare: persistReducer(persistConfig, compareReducer)
    },
    middleware: getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            ignoredActionPaths: ['payload.queryClient'],
        }
    })
})

export const persistor = persistStore(store)