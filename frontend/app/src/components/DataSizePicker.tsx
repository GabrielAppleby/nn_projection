import React from "react";
import {Select, Tooltip, Typography} from "@material-ui/core";
import {selectDataSize} from "../slices/dataSlice";
import {connect, ConnectedProps} from "react-redux";
import {AppDispatch, RootState} from "../app/store";
import {DATA_SIZES, DataSize} from "../types/data";
import {changeDataSizeFetchDataAndProject} from "../app/actions";

const mapStateToProps = (state: RootState) => ({
    dataSize: selectDataSize(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    changeDataSizeFetchDataAndProject: (name: DataSize) => dispatch(changeDataSizeFetchDataAndProject(name)),
});

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>


const DataSizePicker = (props: PropsFromRedux) => {
    const selected = props.dataSize;
    const changeSelection = props.changeDataSizeFetchDataAndProject;


    return (
        <>
            <Tooltip title={'The number of instances to project.'} placement={"top"} arrow>
                <Typography id="dataset-picker" gutterBottom>
                    Data Size
                </Typography>
            </Tooltip>
            <Select
                native
                value={selected}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                    changeSelection(event.target.value as DataSize);
                }}
                inputProps={{
                    name: 'datasize',
                    id: 'datasize-native-simple',
                }}>
                {DATA_SIZES.map((size) => {
                    return <option key={size.toString()} value={size}>{size}</option>
                })
                }
            </Select>
        </>
    );
}

export default connector(DataSizePicker);
