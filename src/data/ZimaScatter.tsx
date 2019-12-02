import React from 'react';

import { Point, translatePoint } from '../interfaces';

import { CanvasContext } from '../ZimaChart';

interface ZimaScatterProps<> {
    data: Point[]
}

const ZimaScatter : React.FunctionComponent<ZimaScatterProps> = ({data} : ZimaScatterProps) => {
    return <CanvasContext.Consumer>
        {context => {
            if(!context || !context.canvas || data.length <= 1)
                return <></>
            const ctx = context.canvas.getContext('2d');
            if(!ctx)
                return <></>

            for(let i = 0; i < data.length; i++) {
                ctx.beginPath();
                const canvasPoint = translatePoint(context.currentDomain, context.canvasDomain, data[i]);
                ctx.arc(canvasPoint.x, canvasPoint.y, 3, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }
        }}
    </ CanvasContext.Consumer>;
}

export default ZimaScatter;