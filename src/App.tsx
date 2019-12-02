import React from 'react';
import './App.css';

import { ZimaChart } from './ZimaChart';
import { Point, AreaPoint } from './interfaces';
import ZimaZoom from './functionality/ZimaZoom'
import ZimaLine from './data/ZimaLine';
import ZimaArea from './data/ZimaArea';
import ZimaScatter from './data/ZimaScatter';
import ZimaPerformance from './debug/ZimaPerformance';


const App: React.FC = () => {

    const areaData : AreaPoint[] = [];
    const lineData : Point[] = [];
    const scatterData : Point[] = [];

    for(let i = -5000; i < 5000; i++) {
        lineData.push({x : i * 0.1, y: Math.sin(i * 0.1) * i * 0.1});
    }

    for(let i = -1250; i < 1250; i++) {
        const a = 25 + Math.random() * 8;
        const b = -25 - Math.random() * 8;
        const areaPoint : AreaPoint = {
            x: i * 0.4, y: [Math.min(a, b), Math.max(a, b)]
        };
        areaData.push(areaPoint);
    }

    for(let i = 0; i < 2500; i++) {
        const x = Math.random() * 1000 - 500;
        const y = Math.random() * 1000 - 500;
        scatterData.push({x, y});
    }

    return (
        <div className="App">
        <ZimaChart width={1600} height={800}>
            <ZimaArea data={areaData} />
            <ZimaLine data={lineData} />
            <ZimaScatter data={scatterData} />
            <ZimaZoom
                axis='both'
                box
                wheel />
            <ZimaPerformance />
        </ZimaChart>
        </div>
    );
}

export default App;
