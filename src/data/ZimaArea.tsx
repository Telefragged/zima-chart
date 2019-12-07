import React from 'react';

import { translatePoint, AreaPoint } from '../interfaces';

import { CanvasContext, RenderCallback } from '../ZimaChart';

interface ZimaAreaProps<> {
    data: AreaPoint[],
    color?: string
}

const ZimaArea : React.FunctionComponent<ZimaAreaProps> = ({data, color} : ZimaAreaProps) => {
    const callbackRef = React.useRef<RenderCallback | null>(null);
    return <CanvasContext.Consumer>
        {context => {
            if(!context || data.length <= 1)
                return <></>

            if (!callbackRef.current) {
                callbackRef.current = (ctx, domain, canvasDomain) => {
                    ctx.beginPath();
                    const fillStyle = ctx.fillStyle;
                    ctx.fillStyle = color ? color : 'rgba(32, 32, 192, 0.3)';
                    for(let i = 0; i < data.length; i++) {
                        const canvasPoint = translatePoint(domain, canvasDomain, {x: data[i].x, y: data[i].y[0]});
                        ctx.lineTo(canvasPoint.x, canvasPoint.y);
                        
                    }
                    for(let i = data.length - 1; i >= 0; i--) {
                        const canvasPoint = translatePoint(domain, canvasDomain, {x: data[i].x, y: data[i].y[1]});
                        ctx.lineTo(canvasPoint.x, canvasPoint.y);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = fillStyle;
                };

                context.registerCallback(callbackRef.current);
            }
        }}
    </ CanvasContext.Consumer>;
}

export default ZimaArea;