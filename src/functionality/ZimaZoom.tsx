import React from 'react';

import { Point, domainDims, domainCenter, interpolate, Domain, translatePoint, domainFromPoints } from '../interfaces';

import { CanvasContext, ZimaChartContext } from '../ZimaChart';

interface ZimaZoomProps {
    axis? : 'x' | 'y' | 'both',
    wheel?: boolean,
    box?: boolean
}

interface ZoomEventHandlers {
    wheelHandler : (event : WheelEvent) => void,
    mouseDownHandler : (event : MouseEvent) => void,
    mouseUpHandler : () => void,
    mouseMoveHandler : (event : MouseEvent) => void,
}

export const ZimaZoom = ({axis, wheel, box} : ZimaZoomProps) => {
    const beginPoint = React.useRef<Point | null>(null);
    const endPoint = React.useRef<Point | null>(null);
    const handlerRef = React.useRef<ZoomEventHandlers | null>(null);
    const contextRef = React.useRef<ZimaChartContext | null>(null);

    const zoom = (mod : number, target : Point) => {
        if(!contextRef.current)
            return;

        const dims = domainDims(contextRef.current.currentDomain);
        const newW = (dims.width * mod) / 2;
        const newH = (dims.height * mod) / 2;

        const c = domainCenter(contextRef.current.currentDomain);
        const interpFac = -(mod - 1);
        const center = { x : interpolate(c.x, target.x, interpFac), y: interpolate(c.y, target.y, interpFac) };

        const newDomain : Domain = {x : [center.x - newW, center.x + newW], y: [center.y - newH, center.y + newH]};

        contextRef.current.setTargetDomain(newDomain);
    };

    const wheelHandler = (event : WheelEvent) => {
        if(!wheel || !contextRef.current)
            return;
        const mod = event.deltaY > 0 ? 2 : 0.5;
        const point = translatePoint(
            contextRef.current.canvasDomain,
            contextRef.current.currentDomain,
            {x: event.offsetX, y: event.offsetY})
        zoom(mod, point);
    };

    const mouseEventToPoint = (event : MouseEvent, defaultValues : Point) => {
        switch(axis) {
            case 'x':
                return { x : event.offsetX, y: defaultValues.y };
            case 'y':
                return {x : defaultValues.x, y: event.offsetY };
            case 'both':
            default:
                return {x : event.offsetX, y : event.offsetY };
        }
    }

    const mouseDownHandler = (event : MouseEvent) => {
        if(!box)
            return;
        beginPoint.current = mouseEventToPoint(event, { x : 0, y: 0});
    };

    const mouseMoveHandler = (event : MouseEvent) => {
        if (!box || !beginPoint.current || !contextRef.current)
            return;

        endPoint.current = mouseEventToPoint(event, {x: contextRef.current.canvasDomain.x[1], y: contextRef.current.canvasDomain.y[1]});
    };

    const mouseUpHandler = () => {
        if(!box || !beginPoint.current || !endPoint.current || !contextRef.current)
            return;

        const point1 = translatePoint(contextRef.current.canvasDomain, contextRef.current.currentDomain, beginPoint.current);
        const point2 = translatePoint(contextRef.current.canvasDomain, contextRef.current.currentDomain, endPoint.current);

        const targetDomain = domainFromPoints(point1, point2);

        contextRef.current.setTargetDomain(targetDomain);
        beginPoint.current = null;
        endPoint.current = null;
    }

    return <CanvasContext.Consumer>
        {canvasContext => {
            if(!canvasContext || !canvasContext.canvas)
                return <></>

            contextRef.current = canvasContext;

            if(!handlerRef.current) {

                handlerRef.current = {
                    wheelHandler,
                    mouseDownHandler,
                    mouseMoveHandler,
                    mouseUpHandler
                }

                canvasContext.canvas.addEventListener('mousedown', handlerRef.current.mouseDownHandler);
                canvasContext.canvas.addEventListener('mousemove', handlerRef.current.mouseMoveHandler);
                canvasContext.canvas.addEventListener('mouseup', handlerRef.current.mouseUpHandler);
                canvasContext.canvas.addEventListener('wheel', handlerRef.current.wheelHandler);
            }

            const canvas = canvasContext.canvas
            const ctx = canvas.getContext('2d');
            if(!ctx)
                return <></>

            if(beginPoint.current && endPoint.current) {
                const fillDomain = domainFromPoints(beginPoint.current, endPoint.current);
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
            return <></>
        }}
    </CanvasContext.Consumer>
};

export default ZimaZoom;