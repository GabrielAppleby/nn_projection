import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import dataReducer from '../slices/dataSlice';
import modelReducer from '../slices/modelSlice';
import projectionReducer from '../slices/projectionSlice';

import {TypedUseSelectorHook, useSelector} from "react-redux";

export const store = configureStore({
    reducer: {
        data: dataReducer,
        model: modelReducer,
        projection: projectionReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
