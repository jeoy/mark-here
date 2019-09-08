import React, { Component } from 'react';
import './left-panel.scss';

export class LeftPanel extends Component {
    state = {
        data: this.props.data
    };

    render() {
        const { data } = this.state;
        return <div className="left-panel">{data}</div>;
    }
}

export default LeftPanel;
