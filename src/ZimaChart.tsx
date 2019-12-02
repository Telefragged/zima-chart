import React from 'react';
import { translatePoint, Domain } from './interfaces';


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

export interface ZimaChartContext {
    canvas?: HTMLCanvasElement,
    currentDomain: Domain,
    canvasDomain: Domain,
    setTargetDomain: (domain : Domain) => void
}

export const CanvasContext = React.createContext<ZimaChartContext | null>(null);

export const ZimaChart : React.FunctionComponent<ZimaChartProps> = ({width, height, children}) => {
    const [samples, setSamples] = React.useState(4000);
    const [domain, setDomain] = React.useState(initialDomain);
    const [startDomain, setStartDomain] = React.useState(initialDomain);
    const [targetDomain, setTargetDomain] = React.useState(initialDomain);
    const [animationStart, setAnimationStart] = React.useState<number | null>(null);
    const forceUpdate = React.useState(0)[1];

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const requestRef = React.useRef<number | null>(null);
    const timeRef = React.useRef<number | null>(null);

    const canvasDomain : Domain = { x: [0, width], y: [0, height]};

    const updateTargetDomain = (newDomain : Domain) => {
        setStartDomain(domain);
        setTargetDomain(newDomain);
        setAnimationStart(timeRef.current);
    }

    const context : ZimaChartContext = {
        canvas: canvasRef.current ? canvasRef.current : undefined,
        currentDomain: domain,
        canvasDomain,
        setTargetDomain: updateTargetDomain
    }

    const animate : FrameRequestCallback = time => {
        if(animationStart) {
            const duration = time - animationStart;
            if(duration > animationMs) {
                setDomain(targetDomain);
                setAnimationStart(null);
            } else {
                setDomain(easeDomain(startDomain, targetDomain, duration, animationMs));
            }
        }
        timeRef.current = time;
        forceUpdate(x => x + 1);
        requestRef.current = requestAnimationFrame(animate);
    }
      
    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    });


    if(canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return <div>Can't get canvas context</div>

        ctx.clearRect(0, 0, width, height);
    }

    return <canvas 
        ref={canvasRef}
        width={width}
        height={height} 
        onClick={() => setSamples(samples + 1)}>
        <CanvasContext.Provider value={context}>
            {children}
        </CanvasContext.Provider>
    </canvas>
}
