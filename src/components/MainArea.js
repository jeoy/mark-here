import React, { Component } from 'react';
import './main-area.scss';
import { scanLine } from './scanLine';

export class MainArea extends Component {
    state = {
        data: this.props.data,
        position: {
            x: 0,
            y: 0
        },
        canvasWith: 0,
        canvasHeight: 0,
        ctx: null
    };

    drawSth = () => {};

    paint = () => {
        var { x, y } = this.state.position;
        const { ctx, canvasHeight, canvasWith } = this.state;
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        scanLine(ctx, x, y, [255, 122, 0, 255], canvasWith, canvasHeight);
    };

    getPosition = e => {
        this.setState({
            position: {
                y: e.clientX,
                x: e.clientY
            }
        });
    };
    componentDidMount() {
        var c = document.getElementById('myCanvas');
        var ctx = c.getContext('2d');

        var canvasWith = 400;
        var canvasHeight = 400;
        this.setState({
            ctx,
            canvasWith,
            canvasHeight
        });
    }
    render() {
        const { canvasHeight, canvasWith } = this.state;
        return (
            <div className="main-area">
                <div>
                    <canvas
                        onClick={this.paint}
                        onMouseMove={this.getPosition}
                        id="myCanvas"
                        style={{ display: 'block' }}
                        width={canvasWith + 'px'}
                        height={canvasHeight + 'px'}></canvas>
                </div>

                <div>
                    [{this.state.position.x}, {this.state.position.y}]
                </div>
            </div>
        );
    }
}

export default MainArea;
