import React, { Component } from 'react';
import './main-area.scss';
import { scanLine } from './scanLine';
import { drawPoint } from '../util/drawShape';

export class MainArea extends Component {
    state = {
        data: this.props.data,
        position: {
            x: 0,
            y: 0
        },
        tool: 'pen',
        penState: 'end',
        canvasWith: 0,
        canvasHeight: 0,
        ctx: null
    };

    drawSth = () => {};

    paint = () => {
        var { x, y } = this.state.position;
        const { ctx, canvasHeight, canvasWith, tool } = this.state;
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        switch (tool) {
            case 'paintCan':
                scanLine(
                    ctx,
                    x,
                    y,
                    [255, 122, 0, 255],
                    canvasWith,
                    canvasHeight
                );

                break;
            default:
                break;
        }
    };

    mouseMoveCb = e => {
        this.setState({
            position: {
                y: e.clientX,
                x: e.clientY
            }
        });
        const { tool, penState, ctx } = this.state;
        if (tool === 'pen' && penState === 'start') {
            drawPoint(ctx, e.clientX, e.clientY);
        }
    };

    usePaintCan = () => {
        this.setState({
            tool: 'paintCan'
        });
    };

    usePen = () => {
        this.setState({
            tool: 'pen'
        });
    };
    startDrag = (e) => {
        this.setState({
            penState: 'start'
        });
        const {ctx} = this.state;
        ctx.lineWidth = 2.0;
        ctx.moveTo(e.clientX, e.clientY)
    };

    stopDrag = () => {
        this.setState({
            penState: 'end'
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
                        onMouseMove={this.mouseMoveCb}
                        onMouseDown={this.startDrag}
                        onMouseUp={this.stopDrag}
                        id="myCanvas"
                        style={{ display: 'block' }}
                        width={canvasWith + 'px'}
                        height={canvasHeight + 'px'}></canvas>
                </div>
                <button onClick={this.usePen}>画笔工具</button>
                <button onClick={this.usePaintCan}>油漆桶工具</button>
                <div>
                    [{this.state.position.x}, {this.state.position.y}]
                </div>
            </div>
        );
    }
}

export default MainArea;
