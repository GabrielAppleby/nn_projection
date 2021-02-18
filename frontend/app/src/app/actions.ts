import {AppDispatch} from "./store";
import {changeDataSize, fetchData} from "../slices/dataSlice";
import {fetchModel} from "../slices/modelSlice";
import {DataSize, Projection} from "../types/data";
import {changeProjection, projectData} from "../slices/projectionSlice";

export const initApp = () => {
    return (dispatch: AppDispatch) => {
        return Promise.all([dispatch(fetchData()), dispatch(fetchModel())]).then(() => {
            return dispatch(projectData());
        });
    }
}

export const changeProjectionAndFetchModel = (projection: Projection) => {
    return (dispatch: AppDispatch) => {
        dispatch(changeProjection(projection))
        return dispatch(fetchModel())
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
