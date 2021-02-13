import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import React, {useEffect} from "react";
import {DefaultAppBar} from "./components/DefaultAppBar";
import {Grid} from "@material-ui/core";
import ResponsiveScatterChart from "./components/charts/ScatterChart";
import HyperparamSlider from "./components/HyperparamSlider";
import DatasetPicker from "./components/DatasetPicker";
import ProjectionPicker from "./components/ProjectionPicker";
import {modelRemoved} from "./slices/modelSlice"
import {initApp} from "./app/actions";


const useStyles = makeStyles({
    app: {
        height: '96vh',
        display: 'flex',
        flexDirection: 'column'
    },
    mainGrid: {
        height: '1%',
        flexGrow: 1
    },
    chartGridContainer: {
        height: '80%'
    },
    bottomGridContainer: {
        margin: 'auto',
        textAlign: 'center',
        height: '20%'
    },
    controls: {
        margin: 'auto',
        textAlign: 'center'
    }
});

export const DefaultPanel: React.FC = (props) => {

    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initApp());
    });

    useEffect(() => {
        return () => {
            dispatch(modelRemoved())
        };
    });

    return (
        <>
            <div className={classes.app}>
                <DefaultAppBar organizationName={"VALT"} appName={"iProject"}/>
                <Grid container item className={classes.mainGrid}>
                    <Grid item xs={12} md={12} className={classes.chartGridContainer}>
                        <ResponsiveScatterChart/>
                    </Grid>
                    <Grid container item xs={12} sm={4} className={classes.bottomGridContainer}>
                        <Grid item xs={12} sm={4} className={classes.controls}>
                            <HyperparamSlider/>
                        </Grid>
                        <Grid item xs={12} sm={2} className={classes.controls}>
                            <DatasetPicker/>
                        </Grid>
                        <Grid item xs={12} sm={2} className={classes.controls}>
                            <ProjectionPicker/>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
