import React from "react";
import {Select, Typography} from "@material-ui/core";
import {selectProjection} from "../slices/projectionSlice";
import {connect, ConnectedProps} from "react-redux";
import {AppDispatch, RootState} from "../app/store";
import {Projection} from "../types/data";
import {changeProjectionFetchModelAndProject} from "../app/actions";

const mapStateToProps = (state: RootState) => ({
    projection: selectProjection(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    changeProjectionAndFetchModel: (projection: Projection) => dispatch(changeProjectionFetchModelAndProject(projection)),
});

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>


const ProjectionPicker = (props: PropsFromRedux) => {
    const selected = props.projection;
    const changeSelection = props.changeProjectionAndFetchModel;


    return (
        <>
            <Typography id="projection-picker" gutterBottom>
                Projection
            </Typography>
            <Select
                native
                value={selected}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    changeSelection(event.target.value as Projection);
                }}
                inputProps={{
                    name: 'projection',
                    id: 'projection-native-simple',
                }}>
                <option value={'umap'}>umap</option>
                <option value={'tsne'}>tsne</option>
            </Select>
        </>
    );
}

export default connector(ProjectionPicker);
