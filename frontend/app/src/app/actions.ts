import {AppDispatch} from "./store";
import {fetchData} from "../slices/dataSlice";
import {fetchModel} from "../slices/modelSlice";
import {Projection} from "../types/data";
import {projectData, changeProjection} from "../slices/projectionSlice";

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
