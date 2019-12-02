import React from 'react';

import { Point, translatePoint } from '../interfaces';

import { CanvasContext, ZimaChartContext } from '../ZimaChart';

interface ZimaLineProps<> {
    data: Point[]
}

const ZimaLine : React.FunctionComponent<ZimaLineProps> = ({data} : ZimaLineProps) => {
    return <CanvasContext.Consumer>
        {context => {
            if(!context || !context.canvas || data.length <= 1)
                return <></>
            const ctx = context.canvas.getContext('2d');
            if(!ctx)
                return <></>

            ctx.beginPath();
            for(let i = 0; i < data.length; i++) {
                const canvasPoint = translatePoint(context.currentDomain, context.canvasDomain, data[i]);
                ctx.lineTo(canvasPoint.x, canvasPoint.y);
            }
            ctx.stroke();
            ctx.closePath();
        }}
    </ CanvasContext.Consumer>;
}

export default ZimaLine;