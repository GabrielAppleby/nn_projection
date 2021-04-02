import React, {ChangeEvent, useState} from "react";
import {Slider, Tooltip, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {connect, ConnectedProps} from "react-redux";
import {AppDispatch, RootState} from "../app/store";
import {selectProjectionHyperparam, updateHyperParamAndProject} from "../slices/projectionSlice";


const useStyles = makeStyles({
    formItemDiv: {
        height: "100%",
        margin: "auto",
        textAlign: "center"
    }
});

const mapStateToProps = (state: RootState) => ({
    hyperparam: selectProjectionHyperparam(state),
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    updateHyperParamAndProject: (hyperparam: number) => dispatch(updateHyperParamAndProject(hyperparam))
});

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>

interface Abortable extends Promise<any> {
    abort: (reason?: string) => void;
}

const HyperparamSlider: React.FC<PropsFromRedux> = (props) => {
    const classes = useStyles();
    const [projectPromise, setProjectPromise] = useState<Abortable | null>(null);
    const hyperparam = props.hyperparam;
    const updateHyperParamAndProject = props.updateHyperParamAndProject;

    return (
        <div className={classes.formItemDiv}>
            <Tooltip
                title={'The hyperparameter value for the chosen projection method. Either perplexity (for t-SNE) or number of neighbors (for UMAP).'}
                placement={"top"} arrow>
                <Typography id="hyperparam-slider" gutterBottom>
                    Hyperparameter
                </Typography>
            </Tooltip>
            <Slider
                key={'hyperparam_slider'}
                orientation="horizontal"
                value={hyperparam}
                onChange={(_: ChangeEvent<{}>, value: number | number[]) => {
                    if (typeof value === "number") {
                        setProjectPromise(updateHyperParamAndProject(value));
                    }
                }}
                onChangeCommitted={(_: ChangeEvent<{}>, value: number | number[]) => {
                    if (typeof value === "number" && projectPromise !== null) {
                        projectPromise.abort();
                        projectPromise.then(() => {
                            updateHyperParamAndProject(value);
                        })
                    }
                }}
                valueLabelDisplay="auto"
                min={2.0}
                max={50.0}
                step={1.0}/>
        </div>
    );
}

export default connector(HyperparamSlider);
