import React from 'react';
import './App.css';

import { ZimaChart } from './ZimaChart';
import { Point } from './interfaces';
import ZimaZoom from './functionality/ZimaZoom'
import ZimaLine from './data/ZimaLine';
import ZimaScatter from './data/ZimaScatter';
import ZimaPerformance from './debug/ZimaPerformance';


const App: React.FC = () => {

    const lineData : Point[] = [];
    const scatterData : Point[] = [];

    for(let i = -5000; i < 5000; i++) {
        lineData.push({x : i * 0.1, y: Math.sin(i * 0.1) * i * 0.1});
    }

    for(let i = 0; i < 1000; i++) {
        const x = Math.random() * 1000 - 500;
        const y = Math.random() * 1000 - 500;
        scatterData.push({x, y});
    }

    return (
        <div className="App">
        <ZimaChart width={1600} height={800}>
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
