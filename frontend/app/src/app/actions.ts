import {AppDispatch} from "./store";
import {changeDataset, changeDataSize, fetchData} from "../slices/dataSlice";
import {fetchModel} from "../slices/modelSlice";
import {Dataset, DataSize, Projection} from "../types/data";
import {changeProjection, projectData} from "../slices/projectionSlice";

export const initApp = () => {
    return (dispatch: AppDispatch) => {
        return Promise.all([dispatch(fetchData()), dispatch(fetchModel())]).then(() => {
            return dispatch(projectData());
        });
    }
}

export const changeProjectionFetchModelAndProject = (projection: Projection) => {
    return (dispatch: AppDispatch) => {
        dispatch(changeProjection(projection)).then(() => {
            return dispatch(fetchModel()).then(() => {
                return dispatch(projectData());
            });
        })
    }
}

export const changeDatasetFetchDataFetchModelAndProject = (dataset: Dataset) => {
    return (dispatch: AppDispatch) => {
        dispatch(changeDataset(dataset)).then(() => {
            return Promise.all([dispatch(fetchData()), dispatch(fetchModel())]).then(() => {
                return dispatch(projectData());
            });
        })
    }
}

export const changeDataSizeFetchDataAndProject = (dataSize: DataSize) => {
    return (dispatch: AppDispatch) => {
        dispatch(changeDataSize(dataSize))
        return dispatch(fetchData()).then(() => {
            return dispatch(projectData());
        });
    }
}
