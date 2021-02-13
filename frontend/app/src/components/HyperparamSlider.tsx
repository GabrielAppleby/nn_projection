import React from "react";
import {Slider, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {

} from "../slices/dataSlice";
import {connect, ConnectedProps} from "react-redux";
import {AppDispatch, RootState} from "../app/store";
import {projectData, selectProjectionHyperparam, updateHyperParam} from "../slices/projectionSlice";


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
    updateHyperParam: (hyperparam: number) => dispatch(updateHyperParam(hyperparam)),
    project: () => dispatch(projectData())
    // updateHyperParamAndProject: (hyperparam: number) => dispatch(updateHyperParamAndProject(hyperparam))
});

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>

const HyperparamSlider: React.FC<PropsFromRedux> = (props) => {
    const classes = useStyles();
    const hyperparam = props.hyperparam;
    const updateHyperParam = props.updateHyperParam;
    const project = props.project;
    // const updateHyperParamAndProject = props.updateHyperParamAndProject;

    return (
        <div className={classes.formItemDiv}>
            <Typography id="hyperparam-slider" gutterBottom>
                Hyperparam
            </Typography>
            <Slider
                key={'hyperparam_slider'}
                orientation="horizontal"
                value={hyperparam}
                onChange={(_, value) => {
                    if (typeof value === "number") {
                        updateHyperParam(value);
                        project();
                    }
                }}
                // onChangeCommitted={(_, value) => {
                //     project();
                // }}
                valueLabelDisplay="auto"
                min={5.0}
                max={45.0}
                step={1.0}/>
        </div>
    );
}

export default connector(HyperparamSlider);
