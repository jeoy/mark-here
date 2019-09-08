import React, { Component } from 'react';
import './main-area.scss';
import { scanLine, getTime } from './scanLine';
import { setTimeout } from 'timers';

export class MainArea extends Component {
    state = {
        data: this.props.data,
        position: {
            x: 0,
            y: 0
        },
        ctx: null
    };

    drawSth = () => {};

    paint = () => {
        var { x, y } = this.state.position;
        const { ctx } = this.state;
        ctx.fillStyle = '#666';
        ctx.lineWidth = 2;
        console.time('scanLine');
        ctx.strokeRect(0, 0, 400, 400);
        scanLine(ctx, x, y, [255,255,0,255]);
        console.timeEnd('scanLine');
    };

    getPosition = e => {
        this.setState({
            position: {
                x: e.clientX - 180,
                y: e.clientY - 140
            }
        });
    };
    componentDidMount() {
        var c = document.getElementById('myCanvas');
        var ctx = c.getContext('2d');
        this.setState({
            ctx
        });

    }
    render() {
        return (
            <div className="main-area">
                <div>
                    [{this.state.position.x}, {this.state.position.y}]
                </div>
                <canvas
                    onClick={this.paint}
                    onMouseMove={this.getPosition}
                    id="myCanvas"
                    width="400"
                    height="400"></canvas>
                <button onClick={this.drawSth}>点我</button>
            </div>
        );
    }
}

export default MainArea;
