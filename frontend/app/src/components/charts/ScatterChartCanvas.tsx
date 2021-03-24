import React, {useEffect, useRef, useState} from "react";

import * as d3 from 'd3';
import {Projections} from "../../types/data";
import {withDimensions} from "../../wrappers/Dimensions";
import {RootState} from "../../app/store";
import {COLORS, ProjectionChartProps} from "./common";
import {connect} from "react-redux";
import {selectAllProjections} from "../../slices/projectionSlice";
import * as twgl from "twgl.js"
import {ProgramInfo} from "twgl.js";


const getExtrema = (data: Projections) => {
    const minX = d3.min(data, d => d.projections[0]);
    const maxX = d3.max(data, d => d.projections[0]);
    const minY = d3.min(data, d => d.projections[1]);
    const maxY = d3.max(data, d => d.projections[1]);

    return {minX, maxX, minY, maxY};
}

const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec3 a_color;
  
  varying vec4 v_color;
   
  void main() {
    vec2 zeroToTwo = a_position * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
 
    gl_Position = vec4(clipSpace, 0, 1);
    gl_PointSize = 2.0;
    
    v_color = vec4(a_color / 255.0, 1.0);
  }
`

const fragmentShaderSource = ` 
  precision mediump float;
  
  varying vec4 v_color;
 
  void main() {
    gl_FragColor = v_color;
  }
`

const ScatterChartCanvas: React.FC<ProjectionChartProps> = (props) => {
    const d3Container = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement>();
    const [gl, setGl] = useState<WebGLRenderingContext>();
    const [programInfo, setProgramInfo] = useState<ProgramInfo>()
    const data = props.data;
    const dimensions = props.dimensions;


    useEffect(() => {
        if (d3Container.current !== null) {
            const tempCanvas = d3Container.current;
            const tempGL = twgl.getContext(tempCanvas);
            if (tempGL !== null)
            {
                setCanvas(tempCanvas);
                setGl(tempGL);
                setProgramInfo(twgl.createProgramInfo(tempGL, [vertexShaderSource, fragmentShaderSource]));

            }
        }
    }, []);


    useEffect(() => {
        if (data !== undefined && canvas !== undefined && gl !== undefined && programInfo !== undefined) {


            const extrema = getExtrema(data);
            if (Object.values(extrema).every(o => o !== undefined)) {
                const positions = twgl.primitives.createAugmentedTypedArray(2, data.length * 2, Float32Array);
                const colors = twgl.primitives.createAugmentedTypedArray(3, data.length * 3, Float32Array);

                data.forEach((d) => {
                    const color = d3.rgb(COLORS(d.label));
                    // @ts-ignore
                    positions.push(d.projections);
                    // @ts-ignore
                    colors.push([color.r, color.g, color.b]);
                })
                const arrays = {a_position: positions, a_color: colors};
                const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
                twgl.resizeCanvasToDisplaySize(canvas);
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.useProgram(programInfo.program);
                twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
                twgl.drawBufferInfo(gl, bufferInfo, gl.POINTS);
            }
        }
    }, [data, canvas, gl, dimensions, programInfo]);

    return (
        <canvas ref={d3Container} id={'canvas'} style={{height: dimensions.height, width: dimensions.width}}/>
    )

}

const ResponsiveScatterChartCanvas = withDimensions(ScatterChartCanvas);

const mapStateToProps = (state: RootState) => ({
    data: selectAllProjections(state),
});

export default connect(
    mapStateToProps,
)(ResponsiveScatterChartCanvas);
