import {makeStyles} from "@material-ui/core/styles";
import {connect, ConnectedProps, useDispatch} from "react-redux";
import React, {useEffect} from "react";
import {DefaultAppBar} from "./components/DefaultAppBar";
import {Grid} from "@material-ui/core";
import ResponsiveScatterChartGL from "./components/charts/ScatterChartGL";
import ResponsiveScatterChart from "./components/charts/ScatterChart";
import HyperparamSlider from "./components/HyperparamSlider";
import DatasetPicker from "./components/DatasetPicker";
import ProjectionPicker from "./components/ProjectionPicker";
import {modelRemoved} from "./slices/modelSlice"
import {initApp} from "./app/actions";
import DataSizePicker from "./components/DataSizePicker";
import BatchSizePicker from "./components/BatchSizePicker";
import ResponsiveLoadingDisplay from "./components/LoadingDisplay";
import {RootState} from "./app/store";
import {selectFetchStatus} from "./slices/dataSlice";
import {selectPlotType} from "./slices/projectionSlice";
import PlotTypePicker from "./components/PlotTypePicker";


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

const mapStateToProps = (state: RootState) => ({
    fetchStatus: selectFetchStatus(state),
    plotType: selectPlotType(state)
});


const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

const DefaultPanel = ({fetchStatus, plotType}: PropsFromRedux) => {

    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initApp());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(modelRemoved())
        };
    }, [dispatch]);

    let mainDisplay = <ResponsiveLoadingDisplay/>;
    if (fetchStatus === 'fulfilled') {
        mainDisplay = plotType === 'webgl' ? <ResponsiveScatterChartGL/> : <ResponsiveScatterChart/>;
    }

    return (
        <>
            <div className={classes.app}>
                <DefaultAppBar organizationName={"VALT"} appName={"iProject"}/>
                <Grid container item className={classes.mainGrid}>
                    <Grid item xs={12} md={12} className={classes.chartGridContainer}>
                        {mainDisplay}
                    </Grid>
                    <Grid container item xs={12} className={classes.bottomGridContainer}>
                        <Grid item xs={12} sm={2} className={classes.controls}>
                            <DatasetPicker/>
                        </Grid>
                        <Grid item xs={12} sm={2} className={classes.controls}>
                            <ProjectionPicker/>
                        </Grid>
                        <Grid item xs={12} sm={2} className={classes.controls}>
                            <HyperparamSlider/>
                        </Grid>
                        <Grid item xs={12} sm={2} className={classes.controls}>
                            <DataSizePicker/>
                        </Grid>
                        <Grid item xs={12} sm={2} className={classes.controls}>
                            <BatchSizePicker/>
                        </Grid>
                        <Grid item xs={12} sm={2} className={classes.controls}>
                            <PlotTypePicker/>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}

export default connector(DefaultPanel);
