import React from 'react';

import { Point, domainDims, domainCenter, interpolate, Domain, translatePoint, domainFromPoints } from '../interfaces';

import { CanvasContext } from '../ZimaChart';

interface ZimaZoomProps {
    axis? : 'x' | 'y' | 'both',
    wheel?: boolean,
    box?: boolean
}

export const ZimaZoom = ({axis, wheel, box} : ZimaZoomProps) => {
    const [beginPoint, setBeginPoint] = React.useState<Point | null>(null);
    const [endPoint, setEndPoint] = React.useState<Point | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    return <CanvasContext.Consumer>
        {context => {
            if(!context)
                return <></>

            const zoom = (mod : number, target : Point) => {
                const dims = domainDims(context.currentDomain);
                const newW = (dims.width * mod) / 2;
                const newH = (dims.height * mod) / 2;

                const c = domainCenter(context.currentDomain);
                const interpFac = -(mod - 1);
                const center = { x : interpolate(c.x, target.x, interpFac), y: interpolate(c.y, target.y, interpFac) };

                const newDomain : Domain = {x : [center.x - newW, center.x + newW], y: [center.y - newH, center.y + newH]};

                context.setTargetDomain(newDomain);
            };

            const mouseEventToPoint = (event : React.MouseEvent<HTMLCanvasElement, MouseEvent>, defaultValues : Point) => {
                switch(axis) {
                    case 'x':
                        return { x : event.nativeEvent.offsetX, y: defaultValues.y };
                    case 'y':
                        return {x : defaultValues.x, y: event.nativeEvent.offsetY };
                    case 'both':
                    default:
                        return {x : event.nativeEvent.offsetX, y : event.nativeEvent.offsetY };
                }
            }

            const {width, height} = domainDims(context.canvasDomain);

            if(canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if(ctx) {
                    ctx.clearRect(0, 0, width, height)

                    if(beginPoint && endPoint) {
                        const fillDomain = domainFromPoints(beginPoint, endPoint);
                        const fillStyle = ctx.fillStyle;
                        ctx.fillStyle = 'rgba(127, 127, 127, 0.2)';
                        ctx.beginPath();
                        ctx.rect(
                            fillDomain.x[0],
                            fillDomain.y[0],
                            fillDomain.x[1] - fillDomain.x[0],
                            fillDomain.y[1] - fillDomain.y[0]
                        );
                        ctx.fill();
                        ctx.closePath();
                        ctx.fillStyle = fillStyle;
                    }
                }
            }

            return <canvas
                style={{position: 'absolute'}}
                ref={canvasRef}
                width={width}
                height={height}
                onWheel={event => {
                    if(!wheel)
                        return;
                    const mod = event.deltaY > 0 ? 2 : 0.5;
                    const point = translatePoint(
                        context.canvasDomain,
                        context.currentDomain,
                        {x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY})
                    zoom(mod, point);
                }}
                onMouseDown={event => {
                    if(!box)
                        return;
                    setBeginPoint(mouseEventToPoint(event, { x : 0, y: 0}));
                }}
                onMouseMove={event => {
                    if (!box || !beginPoint)
                        return;
                    setEndPoint(mouseEventToPoint(event, {x: context.canvasDomain.x[1], y: context.canvasDomain.y[1]}));
                }}
                onMouseUp={() => {
                    if(!box || !beginPoint || !endPoint)
                        return;

                    const point1 = translatePoint(context.canvasDomain, context.currentDomain, beginPoint);
                    const point2 = translatePoint(context.canvasDomain, context.currentDomain, endPoint);

                    const targetDomain = domainFromPoints(point1, point2);

                    context.setTargetDomain(targetDomain);
                    setBeginPoint(null);
                    setEndPoint(null);
                }} />
        }}
    </CanvasContext.Consumer>
};

export default ZimaZoom;