import React from 'react';

import { Point, translatePoint } from '../interfaces';

import { CanvasContext, RenderCallback } from '../ZimaChart';

interface ZimaLineProps<> {
    data: Point[]
}

const ZimaLine : React.FunctionComponent<ZimaLineProps> = ({data} : ZimaLineProps) => {
    const callbackRef = React.useRef<RenderCallback | null>(null);

    return <CanvasContext.Consumer>
        {context => {
            if(!context || data.length <= 1)
                return <></>

            if(!callbackRef.current) {
                callbackRef.current = (ctx, domain, canvasDomain) => {
                    ctx.beginPath();
                    for(let i = 0; i < data.length; i++) {
                        const canvasPoint = translatePoint(domain, canvasDomain, data[i]);
                        ctx.lineTo(canvasPoint.x, canvasPoint.y);
                    }
                    ctx.stroke();
                    ctx.closePath();
                }

                context.registerCallback(callbackRef.current);
            }
        }}
    </ CanvasContext.Consumer>;
}

export default ZimaLine;