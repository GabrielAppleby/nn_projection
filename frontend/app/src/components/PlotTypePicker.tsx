import React from "react";
import {Select, Typography} from "@material-ui/core";
import {changePlotType, selectPlotType} from "../slices/projectionSlice";
import {connect, ConnectedProps} from "react-redux";
import {AppDispatch, RootState} from "../app/store";
import {PlotType} from "../types/data";

const mapStateToProps = (state: RootState) => ({
    plotType: selectPlotType(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    changePlotType: (plotType: PlotType) => dispatch(changePlotType(plotType)),
});

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>


const ProjectionPicker = (props: PropsFromRedux) => {
    const selected = props.plotType;
    const changeSelection = props.changePlotType;


    return (
        <>
            <Typography id="plot-type" gutterBottom>
                Plot Type
            </Typography>
            <Select
                native
                value={selected}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    changeSelection(event.target.value as PlotType);
                }}
                inputProps={{
                    name: 'plottype',
                    id: 'plottype-native-simple',
                }}>
                <option value={'svg'}>svg</option>
                <option value={'webgl'}>webgl</option>
            </Select>
        </>
    );
}

export default connector(ProjectionPicker);
