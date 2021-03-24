import React from "react";
import {Select, Typography} from "@material-ui/core";
import {selectDataset} from "../slices/dataSlice";
import {connect, ConnectedProps} from "react-redux";
import {AppDispatch, RootState} from "../app/store";
import {Dataset} from "../types/data";
import {changeDatasetFetchDataFetchModelAndProject} from "../app/actions";

const mapStateToProps = (state: RootState) => ({
    dataset: selectDataset(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    changeDataset: (name: Dataset) => dispatch(changeDatasetFetchDataFetchModelAndProject(name)),
});

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>


const DatasetPicker = (props: PropsFromRedux) => {
    const selected = props.dataset;
    const changeSelection = props.changeDataset;


    return (
        <>
            <Typography id="dataset-picker" gutterBottom>
                Dataset
            </Typography>
            <Select
                native
                value={selected}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    changeSelection(event.target.value as Dataset);
                }}
                inputProps={{
                    name: 'dataset',
                    id: 'dataset-native-simple',
                }}>
                <option value={'digit'}>digit</option>
                <option value={'fashion'}>fashion</option>
            </Select>
        </>
    );
}

export default connector(DatasetPicker);
