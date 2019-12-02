import React from 'react';
import './App.css';

import { ZimaChart } from './ZimaChart';
import { Point } from './interfaces';
import ZimaZoom from './functionality/ZimaZoom'
import ZimaLine from './data/ZimaLine';


const App: React.FC = () => {

    const data : Point[] = [];

    for(let i = -500; i < 500; i++) {
        data.push({x : i * 0.1, y: Math.sin(i * 0.1) * i * 0.1});
    }

    return (
        <div className="App">
        <ZimaChart width={1600} height={800}>
            <ZimaLine data={data} />
            <ZimaZoom
                axis='both'
                box
                wheel />
        </ZimaChart>
        </div>
    );
}

export default App;
