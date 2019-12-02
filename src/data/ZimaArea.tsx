import React from 'react';

import { translatePoint, AreaPoint } from '../interfaces';

import { CanvasContext } from '../ZimaChart';

interface ZimaAreaProps<> {
    data: AreaPoint[],
    color?: string
}

const ZimaArea : React.FunctionComponent<ZimaAreaProps> = ({data, color} : ZimaAreaProps) => {
    return <CanvasContext.Consumer>
        {context => {
            if(!context || !context.canvas || data.length <= 1)
                return <></>
            const ctx = context.canvas.getContext('2d');
            if(!ctx)
                return <></>

            ctx.beginPath();
            const fillStyle = ctx.fillStyle;
            ctx.fillStyle = color ? color : 'rgba(32, 32, 192, 0.3)';
            for(let i = 0; i < data.length; i++) {
                const canvasPoint = translatePoint(context.currentDomain, context.canvasDomain, {x: data[i].x, y: data[i].y[0]});
                ctx.lineTo(canvasPoint.x, canvasPoint.y);
                
            }
            for(let i = data.length - 1; i >= 0; i--) {
                const canvasPoint = translatePoint(context.currentDomain, context.canvasDomain, {x: data[i].x, y: data[i].y[1]});
                ctx.lineTo(canvasPoint.x, canvasPoint.y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = fillStyle;
        }}
    </ CanvasContext.Consumer>;
}

export default ZimaArea;