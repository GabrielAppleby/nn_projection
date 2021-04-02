import React, {ChangeEvent} from "react";
import {Slider, Tooltip, Typography} from "@material-ui/core";
import {connect, ConnectedProps} from "react-redux";
import {AppDispatch, RootState} from "../app/store";
import {changeBatchSizeAndProject, selectBatchSize} from "../slices/projectionSlice";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    formItemDiv: {
        height: "100%",
        margin: "auto",
        textAlign: "center"
    }
});

const mapStateToProps = (state: RootState) => ({
    batchSize: selectBatchSize(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    changeBatchSizeAndProject: (name: number) => dispatch(changeBatchSizeAndProject(name)),
});

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>


const BatchSizeSlider: React.FC<PropsFromRedux> = (props) => {
    const classes = useStyles();
    const selected = props.batchSize;
    const changeSelection = props.changeBatchSizeAndProject;

    return (
        <div className={classes.formItemDiv}>
            <Tooltip
                title={'The batch size for inference. Higher numbers can result in higher throughput on capable hardware.'}
                placement={"top"} arrow>
                <Typography id="hyperparam-slider" gutterBottom>
                    Batch Size
                </Typography>
            </Tooltip>
            <Slider
                key={'hyperparam_slider'}
                orientation="horizontal"
                value={selected}
                onChange={(_: ChangeEvent<{}>, value: number | number[]) => {
                    if (typeof value === "number") {
                        changeSelection(value);
                    }
                }}
                valueLabelDisplay="auto"
                min={32}
                max={20000}
                step={32}/>
        </div>
    );
}

export default connector(BatchSizeSlider);
