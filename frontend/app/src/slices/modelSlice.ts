import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../app/store';
import * as tf from "@tensorflow/tfjs";
import {getModel} from "../api/modelClient";
import {getDatasetEndpoint} from "../api/common";
import { Status } from '../types/data';


interface ModelState {
    model?: tf.LayersModel;
    modelStatus: Status;
}

const initialState = {
    model: undefined,
    modelStatus: 'idle'
} as ModelState;

export const fetchModel = createAsyncThunk<tf.LayersModel, void, { state: RootState }>('model/fetchModel', async (arg, thunkAPI) => {
    const endPoint = getDatasetEndpoint(thunkAPI.getState().data.name) + '';

    return await getModel(endPoint);
});

export const modelSlice = createSlice({
    name: 'model',
    initialState,
    reducers: {
        modelRemoved(state) {
            if (state.model !== undefined) {
                state.model.dispose();
            }
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchModel.pending, (state) => {
            state.modelStatus = 'pending'
        })
        builder.addCase(fetchModel.fulfilled, (state, action) => {
            state.modelStatus = 'fulfilled'
            state.model = action.payload;
        })
        builder.addCase(fetchModel.rejected, (state) => {
            state.modelStatus = 'rejected'
        })
    }
});

export const {modelRemoved} = modelSlice.actions;

export const selectModel = (state: RootState) => {
    return state.model.model;
}

export default modelSlice.reducer;
