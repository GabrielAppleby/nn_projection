import {createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState,} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../app/store';
import {getData} from '../api/dataClient'
import {Data, DataInstance, Dataset, Status} from "../types/data";
import {getDatasetEndpoint} from "../api/common";


interface DataState extends EntityState<DataInstance> {
    name: Dataset;
    dataStatus: Status;
}


const dataAdapter = createEntityAdapter<DataInstance>({
    selectId: instance => instance.uid
});

const initialState = dataAdapter.getInitialState({
    name: "mnist",
    dataStatus: 'idle',
}) as DataState;


export const fetchData = createAsyncThunk<Data, void, { state: RootState }>('data/fetchData', async (arg, thunkAPI) => {
    const endPoint = getDatasetEndpoint(thunkAPI.getState().data.name) + 's';
    const state = thunkAPI.getState();
    state.projection.worker.getModel();

    return await getData<Data>(endPoint);
});

export const changeDatasetAndFetchData = (dataset: Dataset) => {
    return (dispatch: AppDispatch) => {
        dispatch(changeDataset(dataset))
        return dispatch(fetchData())
    }
}

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        changeDataset(state, action) {
            state.name = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchData.pending, (state, action) => {
            state.dataStatus = 'pending'
        })
        builder.addCase(fetchData.fulfilled, (state, action) => {
            dataAdapter.removeAll(state);
            dataAdapter.upsertMany(state, action.payload)
            state.dataStatus = 'fulfilled'
        })
        builder.addCase(fetchData.rejected, (state, action) => {
            state.dataStatus = 'rejected'
        })
    }
});

export const {changeDataset} = dataSlice.actions;

const dataSelecters = dataAdapter.getSelectors<RootState>(state => state.data);

export const selectAllData = (state: RootState) => {
    return dataSelecters.selectAll(state);
}

export const selectDataset = (state: RootState) => {
    return state.data.name;
}

export const selectFloatFeatureData = createSelector(
    [dataSelecters.selectAll],
    (data) => {
        return data.map((d) => Float32Array.from([0, ...d.features]));
    }
);

export const selectDataIds = createSelector(
    [dataSelecters.selectAll],
    (data) => {
        return data.map((d) => d.uid);
    }
);

export default dataSlice.reducer;
