import React from 'react';

import { Point, translatePoint } from '../interfaces';

import { CanvasContext, RenderCallback } from '../ZimaChart';

interface ZimaScatterProps<> {
    data: Point[]
}

const ZimaScatter : React.FunctionComponent<ZimaScatterProps> = ({data} : ZimaScatterProps) => {
    const callbackRef = React.useRef<RenderCallback | null>(null);

    return <CanvasContext.Consumer>
        {context => {
            if(!context)
                return <></>

            if(!callbackRef.current) {
                callbackRef.current = (ctx, domain, canvasDomain) => {
                    for(let i = 0; i < data.length; i++) {
                        ctx.beginPath();
                        const canvasPoint = translatePoint(domain, canvasDomain, data[i]);
                        ctx.arc(canvasPoint.x, canvasPoint.y, 3, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.closePath();
                    }
                };

                context.registerCallback(callbackRef.current);
            }
        }}
    </ CanvasContext.Consumer>;
}

export default ZimaScatter;