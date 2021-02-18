import {createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState,} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../app/store';
import {getData} from '../api/dataClient'
import {Data, DataInstance, Dataset, DataSize, Status} from "../types/data";
import {getDatasetEndpoint} from "../api/common";


interface DataState extends EntityState<DataInstance> {
    name: Dataset;
    dataSize: DataSize;
    dataStatus: Status;
}


const dataAdapter = createEntityAdapter<DataInstance>({
    selectId: instance => instance.uid
});

const initialState = dataAdapter.getInitialState({
    name: "mnist",
    dataSize: 500,
    dataStatus: 'idle',
}) as DataState;


export const fetchData = createAsyncThunk<Data, void, { state: RootState }>('data/fetchData', async (arg, thunkAPI) => {
    const state = thunkAPI.getState();
    const dataSize = state.data.dataSize;
    const endPoint = getDatasetEndpoint(state.data.name) + 's';

    const data = await getData<Data>(endPoint, dataSize);
    if (data.length > 0) {

        state.projection.worker.setNumFeatures(data[0].features.length + 1);
    }

    return data;
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
        },
        changeDataSize(state, action) {
            state.dataSize = action.payload;
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

export const {changeDataset, changeDataSize} = dataSlice.actions;

const dataSelecters = dataAdapter.getSelectors<RootState>(state => state.data);

export const selectDataset = (state: RootState) => {
    return state.data.name;
}

export const selectDataSize = (state: RootState) => {
    return state.data.dataSize;
}

export const selectFetchStatus = (state: RootState) => {
    return state.data.dataStatus;
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
