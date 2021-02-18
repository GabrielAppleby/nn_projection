import React, {useEffect, useRef, useState} from "react";

import {withDimensions} from "../../wrappers/Dimensions";
import {RootState} from "../../app/store";
import {connect} from "react-redux";
import {Dataset, Point2D, PointMetadata, ScatterGL} from "scatter-gl";
import {selectAllProjections} from "../../slices/projectionSlice";
import {COLORS, ProjectionChartProps} from "./common";

const ScatterChartGL: React.FC<ProjectionChartProps> = (props) => {
    const d3Container = useRef<HTMLDivElement>(null);
    const [scatter, setScatter] = useState<null | ScatterGL>(null);
    const data = props.data;
    const dimensions = props.dimensions;


    useEffect(() => {
        if (d3Container.current !== null) {
            setScatter(new ScatterGL(d3Container.current,
                {showLabelsOnHover: false, selectEnabled: false, rotateOnStart: false}));
        }
    }, [setScatter]);


    useEffect(() => {
        if (data !== undefined && data.length > 0 && d3Container.current !== null && scatter !== null) {
            const dataPoints: Point2D[] = [];
            const metadata: PointMetadata[] = [];
            const colors: string[] = []
            data.forEach((projectedInstance, index) => {
                dataPoints.push([projectedInstance.projections[0], projectedInstance.projections[1]]);
                metadata.push({
                    index,
                    label: projectedInstance.label,
                });
                colors.push(COLORS(projectedInstance.label))
            });
            const dataset = new Dataset(dataPoints, metadata);
            // scatter.setPointColorer({})
            scatter.render(dataset);
            scatter.setPointColorer((index, selectedIndices, hoverIndex) => colors[index])
        }
    }, [scatter, data]);

    useEffect(() => {
        if (scatter !== null) {
            scatter.resize();
        }
    }, [scatter, dimensions]);

    return (
        <div ref={d3Container} style={{height: dimensions.height, width: dimensions.width}}/>
    )

}

const ResponsiveScatterChartGL = withDimensions(ScatterChartGL);

const mapStateToProps = (state: RootState) => ({
    data: selectAllProjections(state),
});

export default connect(
    mapStateToProps,
)(ResponsiveScatterChartGL);
