import React from "react";
import {Select, Typography} from "@material-ui/core";
import {connect, ConnectedProps} from "react-redux";
import {AppDispatch, RootState} from "../app/store";
import {BATCH_SIZES, BatchSize} from "../types/data";
import {changeBatchSizeAndProject, selectBatchSize} from "../slices/projectionSlice";

const mapStateToProps = (state: RootState) => ({
    batchSize: selectBatchSize(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    changeBatchSizeAndProject: (name: BatchSize) => dispatch(changeBatchSizeAndProject(name)),
});

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>


const BatchSizePicker = (props: PropsFromRedux) => {
    const selected = props.batchSize;
    const changeSelection = props.changeBatchSizeAndProject;


    return (
        <>
            <Typography id="dataset-picker" gutterBottom>
                Batch Size
            </Typography>
            <Select
                native
                value={selected}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    changeSelection(parseInt(event.target.value as string) as BatchSize);
                }}
                inputProps={{
                    name: 'batchsize',
                    id: 'batchsize-native-simple',
                }}>
                {BATCH_SIZES.map((size) => {
                    return <option key={size.toString()} value={size}>{size}</option>
                })
                }
            </Select>
        </>
    );
}

export default connector(BatchSizePicker);
