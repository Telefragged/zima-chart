import React from 'react';
import zimaReducer from 'zima-reducer';
import { Domain } from './interfaces';

function easeValue(start: number, target: number, time: number, duration: number) : number {
    const change = target - start;
    time /= duration;
	return -change * time*(time-2) + start;
}

function easeDomain(start: Domain, target: Domain, time: number, duration: number) : Domain {
    return {
        x: 
        [
            easeValue(start.x[0], target.x[0], time, duration),
            easeValue(start.x[1], target.x[1], time, duration)
        ],
        y: 
        [
            easeValue(start.y[0], target.y[0], time, duration),
            easeValue(start.y[1], target.y[1], time, duration)
        ]
    } as Domain;
}

const initialDomain : Domain = { x: [-1, 1], y: [-1, 1] }

interface ZimaChartProps {
    width: number,
    height: number
};

const animationMs = 500;

export type RenderCallback = (ctx: CanvasRenderingContext2D, domain: Domain, canvasDomain: Domain) => void;

export interface ZimaChartContext {
    canvas?: HTMLCanvasElement,
    canvasDomain: Domain,
    setTargetDomain: (updateDomain : (domain: Domain) => Domain) => void,
    registerCallback: (callback: RenderCallback) => void
}

export const CanvasContext = React.createContext<ZimaChartContext | null>(null);

type State = {
    drawCallbacks: RenderCallback[],
    update: number
}

const actions = {
    registerCallback: (state: State, callback: RenderCallback) =>
        ({...state, drawCallbacks: [...state.drawCallbacks, callback]}),
    forceUpdate: (state: State) => ({...state, update: state.update + 1})
}

export const ZimaChart : React.FunctionComponent<ZimaChartProps> = ({width, height, children}) => {
    const [
        {drawCallbacks},
        dispatch] = zimaReducer(actions,
            {
                drawCallbacks: [],
                update: 0
            } as State)

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const requestRef = React.useRef<number | null>(null);
    const animationStartRef = React.useRef<number | undefined>(undefined);
    const domainRef = React.useRef<Domain>(initialDomain);

    const updateDomain = (domain: Domain) => {
        domainRef.current = domain;
    };

    const domainAnimationRef = React.useRef<{startDomain: Domain, targetDomain: Domain}>(
        {startDomain: initialDomain, targetDomain: initialDomain});

    const canvasDomain : Domain = { x: [0, width], y: [0, height]};

    const animate : FrameRequestCallback = time => {
        if(animationStartRef.current) {
            const {startDomain, targetDomain} = domainAnimationRef.current;
            const duration = time - animationStartRef.current;
            if(duration > animationMs) {
                updateDomain(targetDomain);
                requestRef.current = null;
            } else {
                updateDomain(easeDomain(startDomain, targetDomain, duration, animationMs));
                cancelAnimationFrame(requestRef.current!);
                requestRef.current = requestAnimationFrame(animate);
            }
        }
        dispatch.forceUpdate();
    };

    const updateTargetDomain = (newDomain : Domain) => {
        animationStartRef.current = window.performance.now();
        domainAnimationRef.current = {startDomain: domainRef.current, targetDomain: newDomain};
        cancelAnimationFrame(requestRef.current!);
        requestRef.current = requestAnimationFrame(animate);
    }

    const context : ZimaChartContext = {
        canvas: canvasRef.current ? canvasRef.current : undefined,
        canvasDomain,
        setTargetDomain: (updateDomain) => updateTargetDomain(updateDomain(domainRef.current)),
        registerCallback: dispatch.registerCallback
    }
      
    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, []);

    if(canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return <div>Can't get canvas context</div>

        ctx.clearRect(0, 0, width, height);

        for(const callback of drawCallbacks)
            callback(ctx, domainRef.current, canvasDomain);
    }

    return <div style={{position: 'relative', marginLeft: 0, display: 'flexbox', boxAlign: 'center', boxPack: 'center'}}>
        <canvas 
            style={{position: 'absolute'}}
            ref={canvasRef}
            width={width}
            height={height} >
        </canvas>
        <CanvasContext.Provider value={context}>
            {children}
        </CanvasContext.Provider>
    </div>
}
