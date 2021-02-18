import {createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState,} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../app/store';
import {BatchSize, PlotType, ProjectedInstance, Projection, Status} from "../types/data";
import {fetchData, selectDataIds, selectFloatFeatureData} from "./dataSlice";
import Worker from "../worker";
import {selectModel} from "./modelSlice";


interface ProjectionState extends EntityState<ProjectedInstance> {
    projection: Projection;
    hyperparam: number;
    batchSize: BatchSize;
    plotType: PlotType;
    projectionStatus: Status;
    worker: Worker;
}


const projectionAdapter = createEntityAdapter<ProjectedInstance>({
    selectId: instance => instance.uid
});

const initialState = projectionAdapter.getInitialState({
    projection: 'umap',
    hyperparam: 5,
    batchSize: 64,
    plotType: 'svg',
    projectionStatus: 'idle',
    worker: new Worker()
}) as ProjectionState;

export const updateHyperParamAndProject = (hyperparam: number) => {
    return (dispatch: AppDispatch) => {
        dispatch(updateHyperParam(hyperparam))
        return dispatch(projectData())
    }
}

export const changeBatchSizeAndProject = (batchSize: BatchSize) => {
    return (dispatch: AppDispatch) => {
        return dispatch(changeBatchSize(batchSize)).then(() => dispatch(projectData()));
    }
}

export const changeBatchSize = createAsyncThunk<BatchSize, BatchSize, { dispatch: AppDispatch, state: RootState, rejectValue: string }>('projection/changeBatchSize', async (arg, thunkAPI) => {
    const state = thunkAPI.getState();
    state.projection.worker.setBatchSize(arg);
    return arg;
});

type ProjectionChanges = { changes: { projections: number[]; }; id: number; }[];

export const projectData = createAsyncThunk<ProjectionChanges,
    void,
    {
        dispatch: AppDispatch,
        state: RootState,
        rejectValue: string
    }>('projection/projectData', async (arg, thunkAPI) => {
    const state = thunkAPI.getState();
    const model = selectModel(state);
    if (model !== undefined) {
        const featureArray = selectRawFeatureData(state);
        const predictions = await state.projection.worker.runProjection(featureArray);
        const ids = selectDataIds(state);
        return predictions.map((d: number[], i: number) => {
            return {'changes': {'projections': d}, id: ids[i]}
        });
    } else {
        return thunkAPI.rejectWithValue("Model not defined");
    }
}, {
    condition: (arg, api) => {
        return api.getState().projection.projectionStatus !== 'pending'
    }
})

export const projectionSlice = createSlice({
    name: 'projection',
    initialState,
    reducers: {
        changeProjection(state, action) {
            state.projection = action.payload;
        },
        updateHyperParam(state, action) {
            state.hyperparam = action.payload;
        },
        changeBatchSize(state, action) {
            state.batchSize = action.payload;
        },
        changePlotType(state, action) {
            state.plotType = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            if (action.payload !== undefined) {
                projectionAdapter.removeAll(state);
                const emptyProjections = action.payload.map((dataInstance) => {
                    return {uid: dataInstance.uid, label: dataInstance.label, projections: [0, 0]}
                })
                projectionAdapter.upsertMany(state, emptyProjections);
            }
            state.projectionStatus = 'fulfilled'
        })
        builder.addCase(projectData.pending, (state, action) => {
            state.projectionStatus = 'pending'
        })
        builder.addCase(projectData.fulfilled, (state, action) => {
            if (action.payload !== undefined) {
                projectionAdapter.updateMany(state, action.payload)
            }
            state.projectionStatus = 'fulfilled'
        })
        builder.addCase(projectData.rejected, (state, action) => {
            state.projectionStatus = 'rejected'
        })
        builder.addCase(changeBatchSize.fulfilled, (state, action) => {
            state.batchSize = action.payload;
        })
    }
});

export const {updateHyperParam, changeProjection, changePlotType} = projectionSlice.actions;

const dataSelecters = projectionAdapter.getSelectors<RootState>(state => state.projection);

export const selectAllProjections = (state: RootState) => {
    return dataSelecters.selectAll(state);
}

export const selectProjectionHyperparam = (state: RootState) => {
    return state.projection.hyperparam;
}

export const selectProjection = (state: RootState) => {
    return state.projection.projection;
}

export const selectBatchSize = (state: RootState) => {
    return state.projection.batchSize;
}

export const selectPlotType = (state: RootState) => {
    return state.projection.plotType;
}

const selectSABFeatureData = createSelector(
    [selectFloatFeatureData],
    (floatData) => {
        const numFeatures = floatData[0].length;
        const sab = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * floatData.length * numFeatures);
        const fa = new Float32Array(sab);
        for (let i = 0; i < floatData.length; i++) {
            for (let j = 0; j < numFeatures; j++) {
                fa[(i * numFeatures) + j] = floatData[i][j];
            }
        }
        return fa;
    }
);


const selectRawFeatureData = createSelector(
    [selectSABFeatureData, selectProjectionHyperparam],
    (floatData, hyperparam) => {
        const numFeatures = 785;
        for (let i = 0; i < floatData.length; i += numFeatures) {
            floatData[i] = hyperparam;
        }
        return floatData;
    }
);

export default projectionSlice.reducer;
