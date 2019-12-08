import React from 'react';

import { CanvasContext } from '../ZimaChart';

const ZimaPerformance : React.FunctionComponent = () => {

    const frameTimes = React.useRef<number []>([])
    const prevTime = React.useRef<number | undefined>(undefined);

    return <CanvasContext.Consumer>
        {context => {
            if(!context || !context.canvas)
                return <></>
            const ctx = context.canvas.getContext('2d');
            if(!ctx)
                return <></>

            if(!prevTime.current) {
                prevTime.current = window.performance.now();
            }

            const now = window.performance.now();
            const deltaT = now - prevTime.current;

            prevTime.current = now;
            const font = ctx.font;
            ctx.font = '20px Verdana';
            ctx.fillText('fps: ' + (1000 / deltaT).toString(), 10, 30);
            ctx.fillText('ms: ' + deltaT.toString(), 10, 60);
            ctx.font = font;
        }}
    </ CanvasContext.Consumer>;
}

export default ZimaPerformance;