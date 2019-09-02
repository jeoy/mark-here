import React, { Component } from 'react';
import './main-area.scss';

export class MainArea extends Component {
    state = {
        data: this.props.data
    };

    render() {
        return <div className="main-area">MainArea</div>;
    }
}

export default MainArea;
