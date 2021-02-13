import {createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState,} from '@reduxjs/toolkit';
import {AppDispatch, RootState} from '../app/store';
import {ProjectedInstance, Projection, Status} from "../types/data";
import {fetchData, selectDataIds, selectFloatFeatureData} from "./dataSlice";
import Worker from "../worker";
import {selectModel} from "./modelSlice";


interface ProjectionState extends EntityState<ProjectedInstance> {
    projection: Projection;
    hyperparam: number;
    projectionStatus: Status;
    worker: Worker;
}


const projectionAdapter = createEntityAdapter<ProjectedInstance>({
    selectId: instance => instance.uid
});

const initialState = projectionAdapter.getInitialState({
    projection: 'umap',
    hyperparam: 5,
    projectionStatus: 'idle',
    worker: new Worker()
}) as ProjectionState;

export const updateHyperParamAndProject = (hyperparam: number) => {
    return (dispatch: AppDispatch) => {
        dispatch(updateHyperParam(hyperparam))
        return dispatch(projectData())
    }
}

type ProjectionChanges = { changes: { projections: number[]; }; id: number; }[];

export const projectData = createAsyncThunk<ProjectionChanges,
    void,
    {
        dispatch: AppDispatch,
        state: RootState,
        rejectValue: string
    }>('projection/projectData', async (arg, thunkAPI) => {
    // console.log("did this at least start");
    const state = thunkAPI.getState();
    const model = selectModel(state);
    if (model !== undefined) {
        const numFeatures = 785;
        const featureArray = selectRawFeatureData(state);
        state.projection.worker.setNumFeatures(numFeatures);
        const predictions = await state.projection.worker.runProjection(featureArray);
        const ids = selectDataIds(state);
        const changes = predictions.map((d: number[], i: number) => {
            return {'changes': {'projections': d}, id: ids[i]}
        });
        return changes;

        // const ids = selectDataIds(state);
        // const features = tf.tensor(featureArray);
        // const features = tf.tensor(fa).reshape([-1, numFeatures]);
        // console.log(features.shape);
        // console.log("about to predict");

        // const tfPredictions = (model.predict(features, {batchSize: 1024}) as tf.Tensor<tf.Rank.R2>);
        // const predictions = await tfPredictions.array();
        // const changes = predictions.map((d, i) => {
        //     return {'changes': {'projections': d}, id: ids[i]}
        // });
        // tf.dispose(features);
        // tf.dispose(tfPredictions);
        // tf.dispose(predictions);
        // console.log("it actually worked");
        // return changes;
    } else {
        return thunkAPI.rejectWithValue("Model not defined");
    }
}, {condition: (arg, api) => {
        return api.getState().projection.projectionStatus !== 'pending'
    }})

export const projectionSlice = createSlice({
    name: 'projection',
    initialState,
    reducers: {
        changeProjection(state, action) {
            state.projection = action.payload;
        },
        updateHyperParam(state, action) {
            state.hyperparam = action.payload;
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
    }
});

export const {updateHyperParam, changeProjection} = projectionSlice.actions;

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


const selectRawFeatureData = createSelector(
    [selectFloatFeatureData, selectProjectionHyperparam],
    (floatData, hyperparam) => {
        const numFeatures = floatData[0].length;
        const sab = new SharedArrayBuffer(Float32Array.BYTES_PER_ELEMENT * floatData.length * numFeatures);
        const fa = new Float32Array(sab);

        for (let i = 0; i < floatData.length; i++)
        {
            fa[(i*numFeatures)] = hyperparam;
            for (let j = 1; j < numFeatures; j++)
            {
                fa[(i*numFeatures) + j] = floatData[i][j];
            }
        }
        return fa;
    }
);

export default projectionSlice.reducer;
