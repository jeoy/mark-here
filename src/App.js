import React from 'react';
import './App.css';

import LeftPanel from './components/LeftPanel';
import Header from './components/Header';
import MainArea from './components/MainArea';
function App() {
    let data = 'data';
    return (
        <div className="App">
            <Header data={data}></Header>
            <LeftPanel data={data}></LeftPanel>
            <MainArea data={data}></MainArea>
        </div>
    );
}

export default App;
