import React from "react";
import {CircularProgress, Grid, Typography} from "@material-ui/core";
import {Dimensions, withDimensions} from "../wrappers/Dimensions";

export interface LoadingDisplayProps {
    readonly dimensions: Dimensions;
}


const LoadingDisplay = ({dimensions}: LoadingDisplayProps) => {
    const {width, height} = dimensions;
    return (
        <Grid container direction={'column'} style={{width: width, height: height, alignItems: 'center'}}>
            <Typography id="loading-display" gutterBottom align={'center'}
                        style={{textAlign: 'center', margin: 'auto'}}>
                Fetching data, this may take awhile.
            </Typography>
            <CircularProgress style={{margin: 'auto', textAlign: 'center'}} color="secondary"/>
        </Grid>
    );
}

const ResponsiveLoadingDisplay = withDimensions(LoadingDisplay);


export default ResponsiveLoadingDisplay;


